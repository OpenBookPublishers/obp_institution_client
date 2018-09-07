---
title:
  en-US: PageHeader
subtitle: Header
cols: 1
order: 11
---

The header is used to declare the theme of the page, including the most important information that the user is concerned about, so that the user can quickly understand the current page.

## API

| Parameter      | Description                                      | Types of         | Defaults |
|----------|------------------------------------------|-------------|-------|
| title | title 区域 | ReactNode | - |
| logo | logo区域 | ReactNode | - |
| action | 操作区，位于 title 行的行尾 | ReactNode | - |
| content | 内容区 | ReactNode | - |
| extraContent | 额外内容区，位于content的右侧 | ReactNode | - |
| breadcrumbList | 面包屑数据，配置了此属性时 `routes` `params` `location` `breadcrumbNameMap` 无效 | array<{title: ReactNode, href?: string}> | - |
| routes | 面包屑相关属性，router 的路由栈信息 | object[] | - |
| params | 面包屑相关属性，路由的参数 | object | - |
| location | 面包屑相关属性，当前的路由信息 | object | - |
| breadcrumbNameMap | 面包屑相关属性，路由的地址-名称映射表 | object | - |
| tabList | tab 标题列表 | array<{key: string, tab: ReactNode}> | -  |
| tabActiveKey | 当前高亮的 tab 项 | string | -  |
| tabDefaultActiveKey | 默认高亮的 tab 项 | string | 第一项  |
| onTabChange | 切换面板的回调 | (key) => void | -  |
| linkElement | 定义链接的元素，默认为 `a`，可传入 react-router 的 Link | string\|ReactElement | - |

> 面包屑的配置方式有三种，一是直接配置 `breadcrumbList`，二是结合 `react-router@2` `react-router@3`，配置 `routes` 及 `params` 实现，类似 [面包屑 Demo](https://ant.design/components/breadcrumb-cn/#components-breadcrumb-demo-router)，三是结合 `react-router@4`，配置 `location` `breadcrumbNameMap`，优先级依次递减，脚手架中使用最后一种。 对于后两种用法，你也可以将 `routes` `params` 及 `location` `breadcrumbNameMap` 放到 context 中，组件会自动获取。
