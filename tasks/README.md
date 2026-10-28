# Задачи Пурпура

## 1. Единый реестр

Задачи, дефекты, исследования, технический долг, планы и результаты отдела хранятся в этом Git-репозитории. Каноническая запись — `tasks/<id>/README.md`. ID — уникальное краткое имя латиницей в kebab-case. Этот индекс содержит ссылки, а статус, ответственный и план читаются из самой задачи. Чат и GitHub PR помогают обсуждать и доставлять результат, но не заменяют запись.

Ниже находится бэклог по поручению CTO от 27 октября 2026 года. Приоритеты отражают порядок зависимостей и рекомендацию отдела, а не обещания сроков.

## 2. Формат записи

В записи указываются ID, тип, статус, рекомендуемый приоритет, этап, ответственная роль и фактическое назначение. Далее — цель и основание, разрешённые действия, границы, зависимости, наблюдаемые критерии приёмки, единственный план, доказательства проверок и следующий шаг. В строке зависимостей используются относительные ссылки на записи задач или `нет.`. Это позволяет проверить граф автоматически. Для дефекта нужны версия, среда, шаги, ожидаемый и фактический результат. Непроверенная жалоба отмечается как гипотеза до воспроизведения.

Приоритет `P0` означает основной путь покупки или необходимую для него безопасную предпосылку, `P1` — ближайшее развитие и самообслуживание, `P2` — последующее или условное улучшение. Это не шкала аварий и не подтверждённая оценка бизнес-эффекта. Типы: `feature`, `bug`, `research`, `tech-debt`, `ops`, `content`.

Этап `current` относится к нынешней работе с оплатой через менеджера. `future-store` — к будущему полноценному магазину. Исследование будущих контрактов не означает их немедленное внедрение. Этап имеет приоритет над номером приоритета.

### 2.1. Статусы

| Статус | Значение |
| --- | --- |
| `backlog` | Запись создана. Исполнение ещё не начато |
| `ready` | Следующий шаг понятен, необходимые входы и разрешение получены |
| `in-progress` | Есть фактический исполнитель и незавершённая работа |
| `review` | Подготовлен результат и доказательства для проверки или решения человека |
| `blocked` | Названо конкретное отсутствующее условие и что оно останавливает |
| `done` | Проверены критерии, получены требуемые решения и разрешено закрытие |

Статус не запускает агентов, не заменяет разрешение и не доказывает независимую проверку. Закрытые задачи сохраняются в Git. Координатор назначает фактических исполнителей на ограниченный этап. Остальные роли указаны как предполагаемые участники и не считаются занятыми.

## 3. Артефакты и исходники

Полезные обезличенные материалы задачи, макеты, отчёты и выбранные доказательства сохраняются в `tasks/<id>/artifacts/`. Для них указываются источник или редакция, дата, способ проверки и ограничения. Долговременный техпроект остаётся в `docs/techprojects/`, исходники — в `apps/`, без повторных копий. Источник в другой ветке этого же репозитория можно связать постоянной ссылкой на commit.

В Git не попадают секреты, коды входа, персональные записи клиентов, реальные выгрузки БД, кэши, сырые журналы, временные пакеты ревью и результаты сборки. Для проверки используются синтетические данные. Публикация через Git требует соответствующего разрешения. Создание задачи не разрешает правку Prod, отправку сообщений, расходы, слияние PR или подключение сервисов.

Проверка формата, ролей, зависимостей и их циклов: `npm run check:tasks`. Локальная доска с фильтрами и подробностями: `npm run department`, [127.0.0.1:4174](http://127.0.0.1:4174/). Она читает эти же файлы и доступна только для чтения. [Инструкция](../tools/department/README.md). Текущий статус в терминале без второй копии данных: `npm run tasks`. Проверка локальных ссылок задач входит в `npm run check:agents`.

## 4. Задачи

| Задача | Запись |
| --- | --- |
| Основной розничный вход во весь ассортимент | [retail-full-assortment](retail-full-assortment/README.md) |
| Зависание ввода на компьютере во время работы | [desktop-input-freeze](desktop-input-freeze/README.md) |
| Профессиональные контракты всех виртуальных ролей | [role-professional-upgrade](role-professional-upgrade/README.md) |
| Видимая доска задач виртуального отдела | [department-backlog-view](department-backlog-view/README.md) |
| События покупки и самообслуживания | [analytics-event-integration](analytics-event-integration/README.md) |
| Заметность фильма и первый экран концепции | [brand-video-placement](brand-video-placement/README.md) |
| Раздельные входы для корпоративных покупателей и магазинов | [business-entry-scenarios](business-entry-scenarios/README.md) |
| Достоверный приём обращений для бизнеса | [business-inquiry-receipt](business-inquiry-receipt/README.md) |
| Идентификация покупателя и момент первой покупки | [buyer-identity-policy](buyer-identity-policy/README.md) |
| Наблюдение за выбором и заявкой без подсказок | [buyer-task-observation](buyer-task-observation/README.md) |
| Источники цен, фасовок и наличия | [catalog-authority-mapping](catalog-authority-mapping/README.md) |
| Готовность товарных данных к продаже | [catalog-commercial-readiness](catalog-commercial-readiness/README.md) |
| Независимая приёмка полной покупки | [checkout-independent-verification](checkout-independent-verification/README.md) |
| Определения показателей продаж и ручной работы | [commerce-funnel-measures](commerce-funnel-measures/README.md) |
| Состояния интерфейса полной покупки | [commerce-interaction-spec](commerce-interaction-spec/README.md) |
| Процесс покупки, исполнение и исключения | [commerce-process-ownership](commerce-process-ownership/README.md) |
| Новая цель самостоятельной покупки | [commerce-requirements-baseline](commerce-requirements-baseline/README.md) |
| Процедура безопасности покупки и распределение ролей | [commerce-security-handoffs](commerce-security-handoffs/README.md) |
| Разделение корпоративной почты для предложений и продаж | [corporate-email-separation](corporate-email-separation/README.md) |
| Организация корпоративного пространства Figma | [corporate-figma-workspace](corporate-figma-workspace/README.md) |
| Выбор корпоративного мессенджера | [corporate-messenger-evaluation](corporate-messenger-evaluation/README.md) |
| Предложение, согласование и корпоративный заказ | [corporate-quote-lifecycle](corporate-quote-lifecycle/README.md) |
| План развития корпоративных продаж через сайт | [corporate-sales-plan](corporate-sales-plan/README.md) |
| Квалификация корпоративного запроса | [corporate-sales-qualification](corporate-sales-qualification/README.md) |
| Корпоративные почта, мессенджер и Figma | [corporate-tools-plan](corporate-tools-plan/README.md) |
| Жизненный цикл и права на данные покупателя | [customer-data-lifecycle](customer-data-lifecycle/README.md) |
| Контракт покупателя, заказа и исполнения | [customer-order-contract](customer-order-contract/README.md) |
| Сохранённый покупатель после первой покупки | [customer-profile-persistence](customer-profile-persistence/README.md) |
| Самообслуживание покупателя | [customer-self-service](customer-self-service/README.md) |
| Единственный изолированный стенд Dev или Concept | [dev-concept-isolation](dev-concept-isolation/README.md) |
| Выбор и проверка Figma MCP | [figma-mcp-selection](figma-mcp-selection/README.md) |
| Полная покупка гостем на сайте | [guest-online-checkout](guest-online-checkout/README.md) |
| Потеря ввода в прежней витрине | [legacy-checkout-draft-loss](legacy-checkout-draft-loss/README.md) |
| Проверка остатков предыдущего проекта | [legacy-project-audit](legacy-project-audit/README.md) |
| Отсутствующая точка запуска подбора в прежней витрине | [legacy-quiz-entry](legacy-quiz-entry/README.md) |
| Инвентаризация действующих систем после доступов | [live-landscape-inventory](live-landscape-inventory/README.md) |
| Локальный просмотр и инвентаризация инструментов | [macos-setup](macos-setup/README.md) |
| Независимая мобильная и клавиатурная проверка | [mobile-accessibility-check](mobile-accessibility-check/README.md) |
| Ограничение масштабирования публичной витрины | [mobile-zoom-accessibility](mobile-zoom-accessibility/README.md) |
| Защита заказа от повторов и потери ответа | [order-recovery-contract](order-recovery-contract/README.md) |
| Наблюдаемость и восстановление покупки | [order-recovery-observability](order-recovery-observability/README.md) |
| Правила оплаты, получения и возврата | [payment-fulfilment-rules](payment-fulfilment-rules/README.md) |
| Повторный вход по коду на телефон | [phone-code-return-login](phone-code-return-login/README.md) |
| Повторная покупка без лишнего ввода | [repeat-purchase-journey](repeat-purchase-journey/README.md) |
| Задачи и артефакты внутри Git | [repository-workflow](repository-workflow/README.md) |
| Приём розничного заказа с текущей оплатой через менеджера | [retail-order-intake](retail-order-intake/README.md) |
| Ограниченный пилот Rocket.Chat MCP | [rocketchat-mcp-pilot](rocketchat-mcp-pilot/README.md) |
| Ответственность за корпоративные обращения | [sales-case-responsibility](sales-case-responsibility/README.md) |
| SEO и точки входа в прямую продажу | [seo-direct-sales](seo-direct-sales/README.md) |
| Начальный анализ Purpur и стратегия развития | [site-analysis](site-analysis/README.md) |
| Оплата покупки на сайте | [website-online-payment](website-online-payment/README.md) |
