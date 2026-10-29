<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    echo '{"ok":false}';
    exit;
}

$code = trim((string) ($_GET['code'] ?? ''));
$city = trim((string) ($_GET['city'] ?? ''));
if ($code !== '' && !preg_match('/^\d{1,10}$/', $code)) {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}
if ($city !== '' && !preg_match('/^[\p{L}\s.\-]{2,80}$/u', $city)) {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}
if ($code === '' && $city === '') {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}

function cdek_get(string $url): ?array
{
    $handle = curl_init($url);
    if ($handle === false) {
        return null;
    }
    curl_setopt_array($handle, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $body = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);
    if (!is_string($body) || $status !== 200) {
        return null;
    }
    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

if ($code === '') {
    $found = cdek_get('https://integration.cdek.ru/v1/location/cities/json?countryCode=RU&size=8&cityName=' . rawurlencode($city));
    if (!$found) {
        echo '{"ok":false,"points":[]}';
        exit;
    }
    $exact = null;
    foreach ($found as $item) {
        if (!is_array($item)) {
            continue;
        }
        if (mb_strtolower((string) ($item['cityName'] ?? '')) === mb_strtolower($city)) {
            $exact = $item;
            break;
        }
    }
    $chosen = $exact ?? ($found[0] ?? null);
    $code = is_array($chosen) ? (string) ($chosen['cityCode'] ?? '') : '';
    if (!preg_match('/^\d{1,10}$/', $code)) {
        echo '{"ok":true,"points":[]}';
        exit;
    }
}

$list = cdek_get('https://integration.cdek.ru/pvzlist/v1/json?cityid=' . rawurlencode($code)) ?? [];
$points = [];
foreach (($list['pvz'] ?? []) as $item) {
    if (!is_array($item) || ($item['status'] ?? '') !== 'ACTIVE') {
        continue;
    }
    $address = trim((string) ($item['address'] ?? ''));
    $office = trim((string) ($item['code'] ?? ''));
    $place = trim((string) ($item['city'] ?? ''));
    if ($address === '' || $office === '' || $place === '') {
        continue;
    }
    $lat = (float) ($item['coordY'] ?? 0);
    $lon = (float) ($item['coordX'] ?? 0);
    if (!is_finite($lat) || !is_finite($lon) || ($lat === 0.0 && $lon === 0.0)) {
        continue;
    }
    $points[] = ['code' => $office, 'city' => $place, 'address' => $address, 'lat' => $lat, 'lon' => $lon];
    if (count($points) >= 500) {
        break;
    }
}
usort($points, static fn(array $left, array $right): int => strcmp($left['address'], $right['address']));
echo json_encode(['ok' => true, 'points' => $points], JSON_UNESCAPED_UNICODE);
