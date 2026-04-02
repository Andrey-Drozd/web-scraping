# web-scraping

Проект на `Node.js` и `TypeScript`, который показывает базовый `web scraping` с помощью `Puppeteer`.

## Стек

- Node.js
- TypeScript
- Puppeteer
- ESLint

## Что здесь демонстрируется

- автоматизация браузера через `Puppeteer`
- парсинг данных со страницы по CSS-селекторам
- обход нескольких страниц
- подготовка и сохранение результата в `CSV`

## Запуск

```bash
yarn install
yarn build
yarn start
```

После выполнения результат сохраняется в папку:

```text
public/results/
```

## Команды

```bash
yarn build
yarn start
yarn ts-check
yarn lint-check
yarn all-cheks
```

## Структура проекта

```text
.
├── src/realt.by/
├── package.json
├── tsconfig.json
└── yarn.lock
```

## Зачем этот репозиторий

Проект подходит как короткий учебный пример:

- работа с `Puppeteer`
- сбор данных с сайта
- экспорт результатов в файл
