# WaveCalc

Информационная система для расчета параметров радиолинии.

## Что делает приложение

- Расчитывает `FSPL` (потери в свободном пространстве).
- Считает энергетический баланс радиолинии (`Link Budget`).
- Определяет запас по замиранию (`Fade Margin`) и качество канала.
- Показывает график баланса в `Recharts`.
- Визуализирует 1-ю зону Френеля через `SVG`.
- Сохраняет введенные параметры в `localStorage` (через `Zustand persist`).

## Технологии

- `React` + `Vite`
- `TypeScript`
- `Zustand` (`persist`)
- `Tailwind CSS`
- `shadcn/ui` (базовые UI-компоненты)
- `Lucide React` (иконки)
- `Recharts` (графики)
- `Open-Elevation API` (опционально, для высот рельефа)

## Команды проекта

- Установка зависимостей:

```bash
npm install
```

- Запуск в режиме разработки:

```bash
npm run dev
```

- Сборка production-версии:

```bash
npm run build
```

- Локальный просмотр production-сборки:

```bash
npm run preview
```

- Проверка линтером:

```bash
npm run lint
```

## Как запустить проект

1. Откройте терминал в папке проекта `WaveCalc`.
2. Выполните:

```bash
npm install
npm run dev
```

3. Перейдите по адресу из терминала (обычно `http://localhost:5173`).

## Структура проекта

```text
src/
  components/   # бизнес-компоненты (форма, дашборд, визуализация Френеля)
  hooks/        # реактивная логика расчетов
  lib/          # математические формулы и утилиты
  services/     # API-интеграции (высоты рельефа)
  stores/       # Zustand store + persist
  types/        # типы LinkParams и CalcResults
  ui/           # базовые UI-компоненты в стиле shadcn
```

## Основные формулы

- `FSPL = 20 * log10(d) + 20 * log10(f) + 32.44`
  - где `d` — дистанция (км), `f` — частота (МГц)
- `Pr = Pt + Gt + Gr - Lsum`
- `Lsum = Lfs + Lcable + Lconn + Ladd`
- `M = Pr - Psens`

## Примечания

- Для корректных расчетов частота и дистанция должны быть больше нуля.
- Данные формы автоматически сохраняются в браузере.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
