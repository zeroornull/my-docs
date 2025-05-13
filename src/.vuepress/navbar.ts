import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/portfolio",
  // "/demo/",
  {
    text: "面试",
    link: "/interview/",
    icon: "lightbulb",
    // 仅在 `/interview/` 激活
    // activeMatch: "^/interview/$",
  },
  {
    text: "Java",
    link: "/java/",
    icon: "lightbulb",
  },
  {
    text: "Python",
    link: "/python/",
    icon: "lightbulb",
  },
  {
    text: "AI",
    link: "/ai/",
    icon: "lightbulb",
  },
  // {
  //   text: "指南",
  //   icon: "lightbulb",
  //   prefix: "/guide/",
  //   children: [
  //     {
  //       text: "Bar",
  //       icon: "lightbulb",
  //       prefix: "bar/",
  //       children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
  //     },
  //     {
  //       text: "Foo",
  //       icon: "lightbulb",
  //       prefix: "foo/",
  //       children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
  //     },
  //   ],
  // },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
