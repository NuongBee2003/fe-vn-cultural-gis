# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Cấu trúc thư mục (khuyến nghị)

Thư mục `src/` được tổ chức theo hướng dễ mở rộng:

- `apis/`: các hàm gọi API (fetch/axios), tách theo domain
- `assets/`: ảnh, icons, fonts...
- `components/`: component tái sử dụng (UI + domain)
	- `components/ui/`: UI primitives (button, input, popover, table...)
- `constants/`: hằng số/cấu hình dùng chung (paths, nav, dữ liệu tĩnh)
- `hooks/`: custom hooks
- `layouts/`: layout gắn với router (MapLayout, DashboardLayout...)
- `pages/`: page-level components theo route
- `providers/`: React providers (theme, store, i18n...)
- `schemas/`: schema validate (zod/yup...)
- `stores/`: state management (Redux/Zustand...)
- `styles/`: theme/css dùng chung
- `types/`: type definitions (khi chuyển sang TS)
- `utils/`: helpers thuần JS

Entry:

- `src/App.jsx`: wiring router
- `src/routes.jsx`: định nghĩa route config
