<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo '{"ok":false}';
    exit;
}

$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
    http_response_code(403);
    echo '{"ok":false}';
    exit;
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || strlen($raw) > 20000) {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}

$data = json_decode($raw, true);
$kind = is_array($data) ? ($data['kind'] ?? '') : '';
$text = is_array($data) ? ($data['text'] ?? '') : '';
if (!in_array($kind, ['retail', 'business'], true) || !is_string($text)) {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}

$text = str_replace(["\r", "\0"], '', $text);
if (strlen($text) < 20 || strlen($text) > 12000 || strpos($text, 'Пурпур') === false) {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}

$subject = $kind === 'business' ? 'Сотрудничество с Пурпур' : 'Розничная заявка — Пурпур';
$encoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nFrom: Purpur <orders@cj999935.tw1.ru>\r\n";
$sent = mail('orders@cj999935.tw1.ru', $encoded, $text, $headers, '-forders@cj999935.tw1.ru');
if (!$sent) {
    http_response_code(502);
    echo '{"ok":false}';
    exit;
}

echo '{"ok":true}';
