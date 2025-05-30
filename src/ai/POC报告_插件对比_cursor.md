---
title: POC报告_插件对比_cursor
index: true
headerDepth: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

# Cline、Continue 和 Autodev 与 Cursor 功能对比报告

## Cursor 功能详述

根据 [Cursor 官方网站](https://www.cursor.com/) 和相关资源，Cursor 提供以下核心功能：

1. **AI 驱动的代码生成**：根据自然语言指令生成代码片段。
2. **代码库理解**：索引整个代码库，支持自然语言查询。
3. **智能重写**：同时更新多行代码，优化重构效率。
4. **高级自动补全**：基于近期更改预测并建议代码编辑。
5. **聊天功能**：AI 可访问代码库，回答代码相关问题。
6. **终端命令辅助**：将自然语言指令转换为终端命令。
7. **错误检测与自动修复**：自动识别并修复 lint 错误。
8. **全自动AgentMode**：端到端完成复杂任务，保持开发者参与。
9. **集成网页搜索**：通过聊天界面直接搜索网页。
10. **多模态输入**：支持在聊天中添加图片以提供额外上下文。
11. **特定 UI 集成**：使用 @ 符号引用代码文件和符号。

这些功能使 Cursor 成为一个高度集成的 AI 编码环境，特别适合需要快速迭代和复杂任务自动化的开发者。

## 插件功能分析

### Continue

[Continue](https://github.com/continuedev/continue) 是一个开源插件，支持 VSCode 和 JetBrains IDE，提供以下功能：

- **聊天功能**：允许在 IDE 内向大语言模型提问，类似于 Cursor 的聊天辅助（[Continue 文档](https://continue.dev/docs/chat/how-to-use-it)）。
- **自动补全**：提供实时代码建议，与 Cursor 的高级自动补全类似（[Continue 文档](https://continue.dev/docs/autocomplete/how-to-use-it)）。
- **编辑功能**：支持 AI 辅助的代码修改，类似于 Cursor 的智能重写（[Continue 文档](https://continue.dev/docs/edit/how-to-use-it)）。
- **代理模式**：支持更复杂的代码库更改，可能涉及代码库理解，类似于 Cursor 的任务完成代理（[Continue 文档](https://continue.dev/docs/agent/how-to-use-it)）。
- **开源社区支持**：通过社区贡献不断更新功能（[Continue GitHub](https://github.com/continuedev/continue)）。

Continue 的功能与 Cursor 高度匹配，特别是聊天、自动补全和编辑功能，且支持 JetBrains 和 VSCode，使其成为多 IDE 环境的理想选择。

### Cline

[Cline](https://github.com/cline/cline) 是一个 VSCode 插件，提供自主编码代理，基于 Claude 3.5 Sonnet 等 AI 模型，具有以下功能：

- **自主编码代理**：可创建/编辑文件、执行终端命令和进行浏览器交互测试（[Cline 官网](https://cline.bot/)）。
- **代码库管理**：通过文件结构分析、AST 和正则搜索管理大型项目，表明具有代码库理解能力。
- **用户控制**：通过人机交互 GUI 要求用户批准每个文件更改和命令，确保安全性。
- **多模型支持**：兼容 OpenRouter、Anthropic、OpenAI 等多种 AI 模型。
- **独特功能**：支持浏览器调试和端到端测试，如启动网站、点击、输入和捕获日志（[Cline GitHub](https://github.com/cline/cline)）。

Cline 的自主性和代码库管理能力强大，但未明确提供聊天功能，可能限制其与 Cursor 的交互性对比。此外，它目前仅支持 VSCode，尽管有关于 IntelliJ 插件的讨论（[Cline 讨论](https://github.com/cline/cline/discussions/581)），但尚未实现。

### Autodev

[Autodev](https://github.com/unit-mesh/auto-dev) 是一个支持 VSCode 和 JetBrains（特别是 IntelliJ IDEA）的插件，专注于 AI 驱动的编码辅助，提供以下功能：

- **AI 代码生成**：自动生成代码，支持多语言，如 AutoCRUD（Spring）、AutoSQL 等（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。
- **错误修复**：提供错误检测和修复建议，类似于 Cursor 的错误检测功能。
- **聊天功能**：支持与选定代码的上下文感知聊天（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。
- **可定制提示**：允许用户自定义 AI 提示，增强灵活性。
- **自动化功能**：包括自动测试、文档生成和代理功能，可能类似于 Cursor 的任务完成代理。

Autodev 的信息较少，未明确提及代码库理解能力或高级 UI 集成，可能在功能全面性上不如 Continue 和 Cline，但由于项目开源且文档为中文，便于开发。

## 功能对比表

| 功能               | Cursor     | Continue | Cline  | Autodev |
| ------------------ | ---------- | -------- | ------ | ------- |
| AI 驱动的代码生成  | 是         | 是       | 是     | 是      |
| 代码库理解         | 是         | 可能     | 是     | 未明确  |
| 智能重写           | 是         | 是       | 可能   | 可能    |
| 高级自动补全       | 是         | 是       | 未明确 | 未明确  |
| 聊天功能           | 是         | 是       | 未明确 | 是      |
| 终端命令辅助       | 是         | 未明确   | 是     | 是      |
| 错误检测与自动修复 | 是         | 可能     | 是     | 是      |
| 任务完成代理       | 是         | 是       | 是     | 可能    |
| 集成网页搜索       | 是         | 否       | 否     | 否      |
| 多模态输入         | 是         | 否       | 是     | 否      |
| 特定 UI 集成       | 是         | 否       | 是     | 否      |
| 支持 JetBrains     | 不适用     | 是       | 否     | 是      |
| 支持 VSCode        | 是         | 是       | 是     | 是      |
| Agent Mode         | 是、全自动 | 是       | 是     | 是      |

## 分析与推荐

### 核心功能对比

- **代码生成与自动补全**：Continue、Cline 和 Autodev 均通过 AI 插件提供强大支持，功能差异不大。Cursor 的补全可能因项目级上下文更精准。
- **代码库理解**：Cursor 的代码库索引和查询功能更全面，Cline 通过文件结构分析接近此功能，Continue 可能支持但未明确，Autodev 缺乏相关信息。
- **任务完成代理**：Continue 的代理模式、Cline 的自主编码和 Autodev 的自动化功能均支持复杂任务，功能相当。
- **独特功能**：Cursor 的网页搜索和多模态输入是独有功能，Cline 支持多模态输入（如图片），但 Continue 和 Autodev 无此功能。

### 用户体验与集成度

- **Cursor**：作为 AI 优先的编辑器，功能集成度高，操作流畅，特别适合快速开发和 AI 驱动的工作流。
- **Continue**：提供无缝的 IDE 集成，支持 VSCode 和 JetBrains，功能全面，接近 Cursor 的体验。
- **Cline**：在 VSCode 中提供强大的自主编码能力，但缺乏 JetBrains 支持和交互性功能。
- **Autodev**：支持多 IDE，但功能深度和集成度可能不如 Continue。

### 生态系统

- **Cursor**：基于 VSCode，支持所有 VSCode 扩展，生态丰富。
- **Continue**：开源，支持 VSCode 和 JetBrains，社区驱动的扩展性强（[Continue GitHub](https://github.com/continuedev/continue)）。
- **Cline**：专注于 VSCode，生态较局限，但支持多种 AI 模型（[Cline GitHub](https://github.com/cline/cline)）。
- **Autodev**：支持 VSCode 和 JetBrains，生态潜力较大，但目前信息有限（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。

### 性能与局限性

根据 [AlgoCademy 博客](https://algocademy.com/blog/cline-vs-aidr-vs-continue-comparing-top-ai-coding-assistants/)，Continue 在大型项目中可能有性能开销，Cline 提供轻量级本地处理选项，Autodev 的性能信息不足。Cursor 的专有设计可能在性能上更优化，但需权衡其非开源性质。

## Cursor的模式

Cursor 的模式定义了用户与 AI 的交互方式，从手动控制到完全自主。报告中加入这些模式，可以更全面比较插件（如 Continue、Cline、Autodev）是否提供类似功能，尤其是在自主编码和交互模式上。

#### 支持资源

- [Cursor Agent Mode 文档](https://docs.cursor.com/chat/agent)
- [Continue 文档](https://continue.dev/docs/agent/how-to-use-it)

#### Cursor 模式的定义

根据 [Cursor 官方文档](https://docs.cursor.com/chat/overview) 和相关资源，Cursor 的模式现整合在 Chat 接口中（之前称 Composer），包括：

- **Ask Mode**：用于提问和获取答案，无直接代码修改，类似读-only 交互。
- **Manual Mode**：AI 建议代码更改，用户手动应用，适合需要控制的场景。
- **Agent Mode**：最自主模式，AI 可探索代码库、计划并执行复杂任务，如文件编辑和终端命令运行，类似任务完成代理。
- **Custom Modes**：用户定义模式，可定制特定工作流。

#### 功能对比分析

以下表格比较各插件与 Cursor 模式的匹配度：

| **功能/模式**           | **Cursor**                    | **Continue**               | **Cline**                     | **Autodev**                  |
| ----------------------- | ----------------------------- | -------------------------- | ----------------------------- | ---------------------------- |
| 交互式查询（Ask Mode）  | 是（Chat 提问）               | 是（聊天功能）             | 否（无明确聊天）              | 是（聊天功能）               |
| 手动控制（Manual Mode） | 是（建议需手动应用）          | 可能（部分功能需用户确认） | 部分（需批准更改）            | 可能（部分自动化需用户确认） |
| 自主编码（Agent Mode）  | 是（Agent Mode 自主任务完成） | 是（代理模式支持复杂更改） | 是（自主编码代理）            | 可能（自动化功能）           |
| 定制模式（Custom Mode） | 是（用户定义模式）            | 是（开源，可定制）         | 可能（支持多模型和 GUI 控制） | 是（可定制提示）             |

#### 用户体验与集成度

Cursor 的模式提供从低到高自主性的渐进体验，适合不同开发需求。Continue 和 Autodev 因支持多 IDE 和灵活交互，接近 Cursor 的体验。Cline 虽强大但仅限 VSCode，且缺乏交互性，可能不适合需要多样化模式的场景。

#### 结论与建议

鉴于 Cursor 模式的中心作用，建议在报告中新增“交互模式与自主性”部分，详细描述各插件如何匹配 Cursor 的模式。这可提升报告的深度，帮助用户选择适合其工作流的工具。特别关注：

- Continue 因聊天和代理模式最接近 Cursor，推荐优先测试。
- Cline 适合需要高自主性的 VSCode 用户。
- Autodev 可作为备用，需验证功能深度。

#### 关键引用

- [Cursor Agent Mode 文档](https://docs.cursor.com/chat/agent)
- [Cursor Chat 概述](https://docs.cursor.com/chat/overview)
- [Continue 文档](https://continue.dev/docs/agent/how-to-use-it)
- [Cline GitHub 仓库](https://github.com/cline/cline)
- [Autodev GitHub 仓库](https://github.com/unit-mesh/auto-dev)

# IDE Void 对比 Cursor

### 核心要点
- Void 是开源代码编辑器，注重隐私和灵活性；Cursor 是闭源，功能强大但收费。
- Void 支持本地 AI 模型，数据控制更强；Cursor 集成特定 AI，体验更无缝。
- 选择取决于需求：Void 适合注重隐私，Cursor 适合功能优先。

### 对比分析
**概述**  
Void 和 Cursor 都是 AI 驱动的代码编辑器，适合提升开发效率。Void 开源，强调隐私和数据控制；Cursor 闭源，提供更集成化的 AI 体验。

**功能对比**  
| 特征        | Void                       | Cursor                     |
| ----------- | -------------------------- | -------------------------- |
| 开源性      | 是                         | 否                         |
| AI 模型支持 | 支持任意模型，包括本地托管 | 使用 ChatGPT 和 Claude     |
| 数据隐私    | 直接连接 LLM，无中间人     | 默认收集数据，提供隐私模式 |
| 成本        | 免费                       | 每席位 $20                 |

---

### 详细报告
Void 和 Cursor 作为 AI 驱动的代码编辑器，各有特色，适合不同开发者的需求。以下是详细对比，涵盖功能、隐私、成本和适用场景。

#### 基本信息
- **Void**:
  - 开源代码编辑器，由 Mathew Pareles 和 Andrew Pareles 创立，获得 Y Combinator 支持。
  - 是 Visual Studio Code (VS Code) 的分支，继承了 VS Code 的界面和生态系统。
  - 官网：[Void](https://voideditor.com/)。
- **Cursor**:
  - 闭源代码编辑器，由 Anysphere 开发，已获 6000 万美元 Series A 融资。
  - 也是 VS Code 的分支，提供高度集成的 AI 功能。
  - 官网：[Cursor](https://www.cursor.com/en)。

#### 功能对比
以下表格总结了两者的关键功能：

| **特征**        | **Void**                                                     | **Cursor**                                                   |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **开源性**      | 是，开源，允许社区贡献和透明度。                             | 否，闭源，限制自定义和透明度。                               |
| **AI 模型支持** | 支持任意 AI 模型，包括本地托管模型（如 DeepSeek、Llama、Gemini、Qwen）。 | 使用特定模型（如 ChatGPT 和 Claude），灵活性较低。           |
| **数据隐私**    | 直接连接到 LLM（大型语言模型），无中间人，确保数据完全私密。 | 默认收集使用数据和遥测数据，但提供“隐私模式”以避免数据存储和训练。 |
| **基础架构**    | VS Code 的分支，支持一键迁移主题、快捷键和设置。             | VS Code 的分支，但未明确提到迁移支持。                       |
| **AI 工具集成** | 支持 Tab 自动完成、快速编辑、聊天模式（Agent Mode 和 Gather Mode）、LLM 更改检查点、Lint 错误检测、本地工具使用。 | 支持高级自动完成、多行编辑、智能重写、聊天功能（包括代码库查询和网络搜索）。 |
| **Agent Mode**  | 支持任何模型，允许文件管理、终端访问等功能。                 | 支持多文件编辑和自动上下文获取。                             |
| **Gather Mode** | 仅支持读取和搜索，不允许修改或编辑。                         | 未明确提及类似功能。                                         |

#### 详细分析
- **开源性与隐私**:
  - Void 的开源特性使其更具透明度和灵活性，开发者可以完全控制代码和数据。直接连接到 LLM 的方式进一步确保了数据隐私，不需要通过任何中介。
  - Cursor 虽然提供“隐私模式”，但默认情况下会收集使用数据，这可能对高度关注隐私的用户来说是个问题。

- **AI 模型与灵活性**:
  - Void 支持广泛的 AI 模型，包括本地托管的开源模型（如 DeepSeek、Llama），这为用户提供了更大的选择范围和控制权。
  - Cursor 专注于特定模型（如 ChatGPT 和 Claude），虽然强大，但缺乏模型选择的灵活性。

- **功能与用户体验**:
  - **Void**:
    - 提供 Agent Mode 和 Gather Mode，前者允许更深入的代码库交互，后者则限制为只读模式。
    - 支持 Lint 错误检测和快速应用更改（即使在 1000 行文件上），适合需要高效编辑的用户。
    - 作为开源项目，用户可以自定义和扩展功能。
  - **Cursor**:
    - 以其强大的自动完成和聊天功能著称，可以处理多行编辑、智能重写和代码生成。
    - 聊天功能支持代码库查询、网络搜索和图像上下文，提供更全面的交互体验。
    - 用户反馈表明，Cursor 的 AI 集成更无缝，感觉像一个“编码伙伴”。

- **社区与支持**:
  - Void 强调社区参与，提供每周会议和 Discord 社区，适合希望参与开发或定制工具的用户。
  - Cursor 作为商业产品，专注于专业支持和定期更新，适合希望获得稳定且高质量支持的用户。

- **成本**:
  - Void 是免费的，这对预算有限的开发者或小团队非常吸引。
  - Cursor 需要付费（每席位 $20），但其商业模式确保了持续的开发和支持。

#### 总结
Void 和 Cursor 都是强大的 AI 代码编辑器，但它们在设计理念和目标用户上有所不同。Void 以其开源性质、数据隐私和模型灵活性吸引了注重控制和透明度的开发者，而 Cursor 则以其高度集成的 AI 功能和用户友好性吸引了希望获得更流畅编码体验的用户。最终选择取决于您的具体需求：如果隐私和灵活性是首要考虑，那么 Void 是更好的选择；如果您更看重功能丰富度和专业支持，则 Cursor 可能更适合。

# 可参考的IDE和插件

## Cursor竞品

### Trae

### Windsurf

### Void(开源)

https://github.com/voideditor/void

### CodeBuddy 属于插件

## IDEA插件

copilot 闭源需要云端

https://copilot.microsoft.com/

jetbrain AI 闭源需要云端

https://www.jetbrains.com/ai/

jetbrain junie 闭源需要云端

https://www.jetbrains.com/junie/

tabnine 部分开源

https://www.tabnine.com/

CodeGeeX 学术开源

https://github.com/THUDM/CodeGeeX

https://codegeex.cn/

autodev 开源

https://github.com/unit-mesh/auto-dev

continue 开源

https://github.com/continuedev/continue

supermaven

https://supermaven.com/

通义灵码

https://lingma.aliyun.com/

MarsCode(更名Trae Plugin)

https://docs.trae.ai/plugin/what-is-trae-plugin

Codeium windsurf同属公司

aiXcoder

IntelliCode

Kodezi AI

Mintlify Doc Writer

Bito AI

Fitten Code

iFlyCode

Comate

Codefuse

1. CodeGeeX 仅模型开源
   - 开源：学术开源（GitHub: THUDM/CodeGeeX）
   - 商用：支持免费商用
   - 私有化：支持本地部署，可内网使用
   - 备注：基于大模型的代码生成工具，适合中文场景
2. AutoDev
   - 开源：完全开源（GitHub: unit-mesh/auto-dev）
   - 商用：支持商用（Apache License）
   - 私有化：支持本地部署，适于内网使用
   - 备注：专注于自动化开发，灵活性高
3. Continue
   - 开源：完全开源（GitHub: continuedev/continue）
   - 商用：支持商用（Apache License）
   - 私有化：支持本地部署，可内网运行
   - 备注：集成多种 LLM，提供代码补全和调试功能

**其他工具分析**：

- **Tabnine**：部分开源，但核心功能闭源，需云端连接，不完全支持内网私有化。
- **Copilot, JetBrains AI, JetBrains Junie**：闭源，依赖云端，不支持内网私有化。
- **Supermaven, 通义灵码, MarsCode/Trae, Codeium, aiXcoder, IntelliCode, Kodezi AI, Mintlify Doc Writer, Bito AI, Fitten Code, iFlyCode, Comate, Codefuse**：均闭源或未明确开源协议，多数需云端支持，无法满足内网私有化需求。

## VS Code + 插件

### Java Development Plugins

- Java Extension Pack
- Maven for Java
- Spring Boot Extension Pack
  - Spring Boot Tools
  - Spring Initializr Java Support
  - Spring Boot Dashboard
- Visual Studio IntelliCode
- CheckStyle for Java
- Debugger for Java
- Language Support for Java™ by Red Hat
- Java Test Runner
- Java Dependency Viewer
- Tomcat
- Jetty
- Java Linter
- Java Decompiler
- Lombok Annotations Support for VS Code
- Java Properties
- Eclipse Keymap for Visual Studio Code

### AI插件

**Cline**: 
GitHub: [cline/cline](https://github.com/cline/cline)

Continue

autodev

支持jetbrain的几乎都支持vscode

## 热门

augment 
更偏向于大模型调优，而非插件功能



# cursor主要功能

cursor 需要云端互联

## 模式

agent mode 全自动化的代码生成

composer mode 多文件的 代码辅助

manual mode 与 Agent 模式不同，它不探索代码库或运行终端命令;它完全取决于您的具体说明和您提供的上下文

# IDEA + 插件

copilot 闭源需要云端

https://copilot.microsoft.com/

jetbrain AI 闭源需要云端

https://www.jetbrains.com/ai/

jetbrain junie 闭源需要云端

https://www.jetbrains.com/junie/

tabnine 部分开源

https://www.tabnine.com/

CodeGeeX 学术开源

https://github.com/THUDM/CodeGeeX

https://codegeex.cn/

autodev 开源

https://github.com/unit-mesh/auto-dev

continue 开源

https://github.com/continuedev/continue

supermaven

https://supermaven.com/

通义灵码

https://lingma.aliyun.com/

MarsCode(更名Trae Plugin)

https://docs.trae.ai/plugin/what-is-trae-plugin

Codeium windsurf同属公司

aiXcoder

IntelliCode

Kodezi AI

Mintlify Doc Writer

Bito AI

Fitten Code

iFlyCode

Comate

Codefuse

1. CodeGeeX 仅模型开源
   - 开源：学术开源（GitHub: THUDM/CodeGeeX）
   - 商用：支持免费商用
   - 私有化：支持本地部署，可内网使用
   - 备注：基于大模型的代码生成工具，适合中文场景
2. AutoDev
   - 开源：完全开源（GitHub: unit-mesh/auto-dev）
   - 商用：支持商用（Apache License）
   - 私有化：支持本地部署，适于内网使用
   - 备注：专注于自动化开发，灵活性高
3. Continue
   - 开源：完全开源（GitHub: continuedev/continue）
   - 商用：支持商用（Apache License）
   - 私有化：支持本地部署，可内网运行
   - 备注：集成多种 LLM，提供代码补全和调试功能

**其他工具分析**：

- **Tabnine**：部分开源，但核心功能闭源，需云端连接，不完全支持内网私有化。
- **Copilot, JetBrains AI, JetBrains Junie**：闭源，依赖云端，不支持内网私有化。
- **Supermaven, 通义灵码, MarsCode/Trae, Codeium, aiXcoder, IntelliCode, Kodezi AI, Mintlify Doc Writer, Bito AI, Fitten Code, iFlyCode, Comate, Codefuse**：均闭源或未明确开源协议，多数需云端支持，无法满足内网私有化需求。

### VS Code + 插件

### Java Development Plugins

- Java Extension Pack
- Maven for Java
- Spring Boot Extension Pack
  - Spring Boot Tools
  - Spring Initializr Java Support
  - Spring Boot Dashboard
- Visual Studio IntelliCode
- CheckStyle for Java
- Debugger for Java
- Language Support for Java™ by Red Hat
- Java Test Runner
- Java Dependency Viewer
- Tomcat
- Jetty
- Java Linter
- Java Decompiler
- Lombok Annotations Support for VS Code
- Java Properties
- Eclipse Keymap for Visual Studio Code

### AI插件
**Cline**: 
GitHub: [cline/cline](https://github.com/cline/cline)

Continue

autodev

支持jetbrain的几乎都支持vscode

# cursor竞品

## Trae

## Windsurf

## Void(开源)

https://github.com/voideditor/void

## CodeBuddy

# augment

更偏向AI大模型调优而非工具


## 对比报告
## Cursor 的主要功能

Cursor 利用大型语言模型（LLM）提供以下核心功能，基于其官方文档和相关资源：

1. **AI 驱动的代码生成**：根据自然语言指令生成代码片段。
2. **代码库理解**：索引整个代码库，支持自然语言查询。
3. **智能重写**：同时更新多行代码，优化重构效率。
4. **高级自动补全**：基于近期更改预测并建议代码编辑。
5. **聊天功能**：AI 可访问代码库，回答代码相关问题。
6. **终端命令辅助**：将自然语言指令转换为终端命令。
7. **错误检测与自动修复**：自动识别并修复 lint 错误。
8. **任务完成代理**：端到端完成复杂任务，保持开发者参与。
9. **集成网页搜索**：通过聊天界面直接搜索网页。
10. **多模态输入**：支持在聊天中添加图片以提供额外上下文。
11. **特定 UI 集成**：使用 @ 符号引用代码文件和符号。

这些功能使 Cursor 成为一个高度集成的 AI 编码环境，特别适合需要快速迭代和复杂任务自动化的开发者。

## JetBrains IDEs 的插件实现

JetBrains IDEs 通过多种 AI 插件提供类似功能，以下是对每个 Cursor 功能的实现情况分析：

| **功能**           | **JetBrains 插件实现**                                       | **备注**                                                     |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| AI 驱动的代码生成  | [JetBrains AI Assistant](https://www.jetbrains.com/ai/) 和 [GitHub Copilot](https://github.com/features/copilot) 支持自然语言代码生成。 | 功能接近 Cursor，但提示工程可能不如 Cursor 优化。            |
| 代码库理解         | [Bito](https://bito.ai/)（团队计划）可索引代码库并支持查询，JetBrains AI Assistant 提供部分上下文感知。 | Bito 接近 Cursor 的代码库理解，JetBrains AI Assistant 上下文有限。 |
| 智能重写           | 内置重构工具结合 JetBrains AI Assistant 实现多行代码更新。   | 重构功能强大，但 AI 驱动重写可能不如 Cursor 智能。           |
| 高级自动补全       | GitHub Copilot 和 JetBrains AI Assistant 提供多行代码建议。  | 与 Cursor 的自动补全功能相当，集成度略有差异。               |
| 聊天功能           | JetBrains AI Assistant 和 Bito 提供代码相关问答。            | Bito 需团队计划，JetBrains AI Assistant 更原生。             |
| 终端命令辅助       | JetBrains AI Assistant 支持生成终端命令。                    | 功能与 Cursor 类似，体验一致。                               |
| 错误检测与自动修复 | 内置 lint 工具，AI 插件（如 JetBrains AI Assistant）增强修复能力。 | 修复能力接近，但 Cursor 的 AI 修复可能更智能。               |
| 任务完成代理       | JetBrains Junie 提供任务委托功能，类似 Cursor 的代理模式。   | Junie 与 Cursor 代理功能相当，但集成度可能稍逊。             |
| 集成网页搜索       | 无插件支持从聊天界面直接搜索网页。                           | 需手动在浏览器搜索，功能缺失。                               |
| 多模态输入         | 无插件支持在聊天中添加图片。                                 | Cursor 的多模态功能独有。                                    |
| 特定 UI 集成       | 无 @ 符号引用代码的插件，依赖标准导航功能。                  | JetBrains 导航功能强大，但 UI 方式不同。                     |

### JetBrains 插件亮点

- **JetBrains AI Assistant**：提供上下文感知的代码生成、补全和聊天功能，支持多种编程语言。Junie 作为 AI 代理，可自动完成复杂任务。
- **GitHub Copilot**：专注于代码补全和生成，广泛应用于 JetBrains IDEs。
- **Bito**：提供代码库级别的理解和 AI 代码审查，适合团队协作。

### 局限性

JetBrains 的 AI 插件在代码库理解方面可能不如 Cursor 全面，尤其是 JetBrains AI Assistant 的上下文感知主要局限于当前文件或选定代码片段。网页搜索和多模态输入等功能目前无直接替代。

## VSCode 的插件实现

VSCode 作为 Cursor 的基础平台，拥有丰富的扩展生态。以下是对 Cursor 功能的实现情况分析：

| **功能**           | **VSCode 插件实现**                                          | **备注**                                           |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------- |
| AI 驱动的代码生成  | [GitHub Copilot](https://github.com/features/copilot)、[Bito](https://bito.ai/)、Tabnine 支持代码生成。 | 功能与 Cursor 相当，Copilot 使用最广泛。           |
| 代码库理解         | GitHub Copilot 和 Bito 支持代码库索引和查询。                | 功能接近 Cursor，Copilot 提供本地和远程索引。      |
| 智能重写           | 标准重构扩展（如 Refactor by JS）结合 AI 插件实现。          | 不如 Cursor 的 AI 重写智能，需手动调整。           |
| 高级自动补全       | GitHub Copilot、Bito 提供多行代码建议。                      | 与 Cursor 自动补全功能类似，体验接近。             |
| 聊天功能           | Bito、GitHub Copilot 提供 AI 聊天，访问代码库。              | Bito 需团队计划，Copilot 集成更流畅。              |
| 终端命令辅助       | Terminal GPT 和 GitHub Copilot 支持 AI 终端命令生成。        | 功能与 Cursor 类似，但集成度可能较低。             |
| 错误检测与自动修复 | 内置 lint 工具，AI 插件（如 Bito）增强修复能力。             | 修复能力接近，但 Cursor 的 AI 修复更智能。         |
| 任务完成代理       | GitHub Copilot 的代理模式支持多文件编辑和任务完成。          | 功能与 Cursor 代理模式相当，但可能需更多手动配置。 |
| 集成网页搜索       | 无扩展支持聊天界面网页搜索。                                 | 需手动搜索，功能缺失。                             |
| 多模态输入         | 无扩展支持聊天中添加图片。                                   | Cursor 的多模态功能独有。                          |
| 特定 UI 集成       | 无 @ 符号引用代码的扩展，依赖标准导航。                      | VSCode 导航功能强大，但 UI 方式不同。              |

### VSCode 插件亮点

- **GitHub Copilot**：提供代码生成、补全和代理模式，支持代码库索引（本地和 GitHub），是 VSCode 最流行的 AI 插件。
- **Bito**：提供代码库理解、AI 代码审查和生成，适合需要深入代码分析的开发者。
- **扩展生态**：VSCode 支持大量其他 AI 插件（如 Tabnine、Codeium），提供灵活的选择。

### 局限性

VSCode 插件在代码库理解和任务代理方面接近 Cursor，但网页搜索和多模态输入功能缺失。AI 重写功能依赖标准重构工具，智能程度可能不如 Cursor。

## 功能对比分析

### 核心功能对比

- **代码生成与自动补全**：三者均通过 AI 插件提供强大支持，功能差异不大。Cursor 的补全可能因项目级上下文更精准。
- **代码库理解**：Cursor 的代码库索引和查询功能更全面，JetBrains 和 VSCode 通过 Bito 和 Copilot 接近，但深度可能稍逊。
- **任务完成代理**：Cursor 的代理模式、JetBrains 的 Junie 和 VSCode 的 Copilot 代理模式均支持复杂任务自动化，功能相当。
- **独特功能**：Cursor 的网页搜索和多模态输入是独有功能，JetBrains 和 VSCode 插件无法直接实现。

### 用户体验与集成度

- **Cursor**：作为 AI 优先的编辑器，功能集成度高，操作流畅，特别适合快速开发和 AI 驱动的工作流。
- **JetBrains**：IDE 本身功能强大，AI 插件增强编码体验，但插件间的集成可能不如 Cursor 紧密。
- **VSCode**：灵活的扩展生态允许高度定制，但 AI 功能的无缝性可能因插件差异而降低。

### 生态系统

- **Cursor**：基于 VSCode，支持所有 VSCode 扩展，生态丰富。
- **JetBrains**：拥有强大的 IDE 生态，插件市场成熟，适合复杂项目。
- **VSCode**：扩展生态最为广泛，适合轻量和多样化开发需求。

## 结论与建议

JetBrains 和 VSCode 通过插件（如 GitHub Copilot、Bito、JetBrains AI Assistant）可以实现 Cursor 的大部分功能，包括代码生成、补全、代码库理解和任务代理。然而，Cursor 在集成度和用户体验上具有优势，其网页搜索和多模态输入等功能目前无直接替代。对于追求无缝 AI 体验的开发者，Cursor 是更优选择；对于偏好 JetBrains 或 VSCode 生态的开发者，现有插件已能满足大部分需求。

### 选择建议

- **选择 Cursor**：如果您优先考虑 AI 驱动的编码体验，愿意尝试新工具，且需要网页搜索或多模态输入功能。
- **选择 JetBrains**：如果您依赖 JetBrains IDE 的强大功能（如调试、测试），并通过 Junie 或 Bito 获得类似 AI 支持。
- **选择 VSCode**：如果您喜欢轻量、灵活的编辑器，熟悉 VSCode 生态，且 Copilot 或 Bito 能满足 AI 需求。

# 可私有化部署的插件

Cline
https://github.com/cline/cline

Continue

https://github.com/continuedev/continue

autodev

https://github.com/unit-mesh/auto-dev

# Cline、Continue 和 Autodev 与 Cursor 功能对比报告

## 概述

本报告比较了 Cline、Continue 和 Autodev 三个插件在 JetBrains 和 VSCode 环境中实现类似 [Cursor](https://www.cursor.com/) 的 AI 辅助编码能力的功能，旨在为编写概念验证（POC）报告提供依据。Cursor 是一个基于 Visual Studio Code 的 AI 驱动代码编辑器，集成了先进的 AI 功能以提升开发者生产力。目标是确定哪个插件在代码生成、聊天辅助、代码库理解和重构等方面最接近 Cursor。

## Cursor 功能详述

根据 [Cursor 官方网站](https://www.cursor.com/) 和相关资源，Cursor 提供以下核心功能：

1. **AI 驱动的代码生成**：根据自然语言指令生成代码片段。
2. **代码库理解**：索引整个代码库，支持自然语言查询。
3. **智能重写**：同时更新多行代码，优化重构效率。
4. **高级自动补全**：基于近期更改预测并建议代码编辑。
5. **聊天功能**：AI 可访问代码库，回答代码相关问题。
6. **终端命令辅助**：将自然语言指令转换为终端命令。
7. **错误检测与自动修复**：自动识别并修复 lint 错误。
8. **任务完成代理**：端到端完成复杂任务，保持开发者参与。
9. **集成网页搜索**：通过聊天界面直接搜索网页。
10. **多模态输入**：支持在聊天中添加图片以提供额外上下文。
11. **特定 UI 集成**：使用 @ 符号引用代码文件和符号。

这些功能使 Cursor 成为一个高度集成的 AI 编码环境，特别适合需要快速迭代和复杂任务自动化的开发者。

## 插件功能分析

### Continue

[Continue](https://github.com/continuedev/continue) 是一个开源插件，支持 VSCode 和 JetBrains IDE，提供以下功能：

- **聊天功能**：允许在 IDE 内向大语言模型提问，类似于 Cursor 的聊天辅助（[Continue 文档](https://continue.dev/docs/chat/how-to-use-it)）。
- **自动补全**：提供实时代码建议，与 Cursor 的高级自动补全类似（[Continue 文档](https://continue.dev/docs/autocomplete/how-to-use-it)）。
- **编辑功能**：支持 AI 辅助的代码修改，类似于 Cursor 的智能重写（[Continue 文档](https://continue.dev/docs/edit/how-to-use-it)）。
- **代理模式**：支持更复杂的代码库更改，可能涉及代码库理解，类似于 Cursor 的任务完成代理（[Continue 文档](https://continue.dev/docs/agent/how-to-use-it)）。
- **开源社区支持**：通过社区贡献不断更新功能（[Continue GitHub](https://github.com/continuedev/continue)）。

Continue 的功能与 Cursor 高度匹配，特别是聊天、自动补全和编辑功能，且支持 JetBrains 和 VSCode，使其成为多 IDE 环境的理想选择。

### Cline

[Cline](https://github.com/cline/cline) 是一个 VSCode 插件，提供自主编码代理，基于 Claude 3.5 Sonnet 等 AI 模型，具有以下功能：

- **自主编码代理**：可创建/编辑文件、执行终端命令和进行浏览器交互测试（[Cline 官网](https://cline.bot/)）。
- **代码库管理**：通过文件结构分析、AST 和正则搜索管理大型项目，表明具有代码库理解能力。
- **用户控制**：通过人机交互 GUI 要求用户批准每个文件更改和命令，确保安全性。
- **多模型支持**：兼容 OpenRouter、Anthropic、OpenAI 等多种 AI 模型。
- **独特功能**：支持浏览器调试和端到端测试，如启动网站、点击、输入和捕获日志（[Cline GitHub](https://github.com/cline/cline)）。

Cline 的自主性和代码库管理能力强大，但未明确提供聊天功能，可能限制其与 Cursor 的交互性对比。此外，它目前仅支持 VSCode，尽管有关于 IntelliJ 插件的讨论（[Cline 讨论](https://github.com/cline/cline/discussions/581)），但尚未实现。

### Autodev

[Autodev](https://github.com/unit-mesh/auto-dev) 是一个支持 VSCode 和 JetBrains（特别是 IntelliJ IDEA）的插件，专注于 AI 驱动的编码辅助，提供以下功能：

- **AI 代码生成**：自动生成代码，支持多语言，如 AutoCRUD（Spring）、AutoSQL 等（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。
- **错误修复**：提供错误检测和修复建议，类似于 Cursor 的错误检测功能。
- **聊天功能**：支持与选定代码的上下文感知聊天（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。
- **可定制提示**：允许用户自定义 AI 提示，增强灵活性。
- **自动化功能**：包括自动测试、文档生成和代理功能，可能类似于 Cursor 的任务完成代理。

Autodev 的信息较少，未明确提及代码库理解能力或高级 UI 集成，可能在功能全面性上不如 Continue 和 Cline。

## 功能对比表

| 功能               | Cursor     | Continue | Cline  | Autodev |
| ------------------ | ---------- | -------- | ------ | ------- |
| AI 驱动的代码生成  | 是         | 是       | 是     | 是      |
| 代码库理解         | 是         | 可能     | 是     | 未明确  |
| 智能重写           | 是         | 是       | 可能   | 可能    |
| 高级自动补全       | 是         | 是       | 未明确 | 未明确  |
| 聊天功能           | 是         | 是       | 未明确 | 是      |
| 终端命令辅助       | 是         | 未明确   | 是     | 是      |
| 错误检测与自动修复 | 是         | 可能     | 是     | 是      |
| 任务完成代理       | 是         | 是       | 是     | 可能    |
| 集成网页搜索       | 是         | 否       | 否     | 否      |
| 多模态输入         | 是         | 否       | 是     | 否      |
| 特定 UI 集成       | 是         | 否       | 是     | 否      |
| 支持 JetBrains     | 不适用     | 是       | 否     | 是      |
| 支持 VSCode        | 是         | 是       | 是     | 是      |
| Agent Mode         | 是、全自动 | 是       | 是     | 是      |



## 分析与推荐

### 核心功能对比

- **代码生成与自动补全**：Continue、Cline 和 Autodev 均通过 AI 插件提供强大支持，功能差异不大。Cursor 的补全可能因项目级上下文更精准。
- **代码库理解**：Cursor 的代码库索引和查询功能更全面，Cline 通过文件结构分析接近此功能，Continue 可能支持但未明确，Autodev 缺乏相关信息。
- **任务完成代理**：Continue 的代理模式、Cline 的自主编码和 Autodev 的自动化功能均支持复杂任务，功能相当。
- **独特功能**：Cursor 的网页搜索和多模态输入是独有功能，Cline 支持多模态输入（如图片），但 Continue 和 Autodev 无此功能。

### 用户体验与集成度

- **Cursor**：作为 AI 优先的编辑器，功能集成度高，操作流畅，特别适合快速开发和 AI 驱动的工作流。
- **Continue**：提供无缝的 IDE 集成，支持 VSCode 和 JetBrains，功能全面，接近 Cursor 的体验。
- **Cline**：在 VSCode 中提供强大的自主编码能力，但缺乏 JetBrains 支持和交互性功能。
- **Autodev**：支持多 IDE，但功能深度和集成度可能不如 Continue。

### 生态系统

- **Cursor**：基于 VSCode，支持所有 VSCode 扩展，生态丰富。
- **Continue**：开源，支持 VSCode 和 JetBrains，社区驱动的扩展性强（[Continue GitHub](https://github.com/continuedev/continue)）。
- **Cline**：专注于 VSCode，生态较局限，但支持多种 AI 模型（[Cline GitHub](https://github.com/cline/cline)）。
- **Autodev**：支持 VSCode 和 JetBrains，生态潜力较大，但目前信息有限（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。

### 性能与局限性

根据 [AlgoCademy 博客](https://algocademy.com/blog/cline-vs-aidr-vs-continue-comparing-top-ai-coding-assistants/)，Continue 在大型项目中可能有性能开销，Cline 提供轻量级本地处理选项，Autodev 的性能信息不足。Cursor 的专有设计可能在性能上更优化，但需权衡其非开源性质。

## 结论与建议

Continue 是最接近 Cursor 的插件，因其提供聊天、自动补全、编辑和代理功能，且支持 JetBrains 和 VSCode。它的开源性质和社区支持确保持续改进，适合需要跨 IDE 一致体验的开发者。Cline 提供强大的自主编码能力，适合需要自动化和代码库管理的 VSCode 用户，但缺乏聊天功能和 JetBrains 支持，限制了其通用性。Autodev 专注于代码生成和错误修复，可能适合特定自动化任务，但功能信息不足，难以全面匹配 Cursor。

### 选择建议

- **选择 Continue**：如果您优先考虑跨 JetBrains 和 VSCode 的 AI 驱动编码体验，需要聊天、自动补全和代理功能（[Continue 官网](https://www.continue.dev/)）。
- **选择 Cline**：如果您使用 VSCode，专注于自主编码任务，如文件管理和浏览器调试（[Cline 官网](https://cline.bot/)）。
- **选择 Autodev**：如果您需要 JetBrains 和 VSCode 的基本 AI 代码生成和错误修复功能，但需进一步验证其功能深度（[Autodev GitHub](https://github.com/unit-mesh/auto-dev)）。

对于 POC 开发，建议优先测试 Continue，以验证其在实际开发场景中的表现，特别是在代码生成、聊天辅助和代码库理解方面的能力。

### 直接回答

- **关键点**：建议在报告中加入 Cursor 的模式（Agent Mode、Composer Mode、Manual Mode 和 Custom Mode），因为它们是 Cursor 核心功能，反映 AI 辅助编码的交互和自主性。

#### 为什么重要
Cursor 的模式定义了用户与 AI 的交互方式，从手动控制到完全自主。报告中加入这些模式，可以更全面比较插件（如 Continue、Cline、Autodev）是否提供类似功能，尤其是在自主编码和交互模式上。

#### 建议添加内容
在报告中新增“交互模式与自主性”部分，详细描述每个插件如何支持类似 Cursor 的模式。例如：
- Continue 有聊天和代理模式，类似 Cursor 的 Ask 和 Agent Mode。
- Cline 专注于自主编码，类似 Agent Mode，但缺乏交互。
- Autodev 支持聊天和自动化，覆盖部分模式。

#### 支持资源
- [Cursor Agent Mode 文档](https://docs.cursor.com/chat/agent)
- [Continue 文档](https://continue.dev/docs/agent/how-to-use-it)

---

### 调查笔记

#### 引言
本报告分析是否应在比较 Cline、Continue 和 Autodev 与 Cursor 功能的报告中加入 Cursor 的三种模式（Agent Mode、Composer Mode、Manual Mode）及 Custom Mode。这些模式反映 Cursor 在 AI 辅助编码中的交互和自主性水平，加入它们可提升报告的全面性，尤其在评估插件是否提供类似功能时。

#### Cursor 模式的定义
根据 [Cursor 官方文档](https://docs.cursor.com/chat/overview) 和相关资源，Cursor 的模式现整合在 Chat 接口中（之前称 Composer），包括：
- **Ask Mode**：用于提问和获取答案，无直接代码修改，类似读-only 交互。
- **Manual Mode**：AI 建议代码更改，用户手动应用，适合需要控制的场景。
- **Agent Mode**：最自主模式，AI 可探索代码库、计划并执行复杂任务，如文件编辑和终端命令运行，类似任务完成代理。
- **Custom Modes**：用户定义模式，可定制特定工作流。

然而，用户提到的 Composer Mode 在最新版本中可能指 Chat 接口的某些功能，尤其是在多文件编辑和应用生成方面（如 [Cursor Composer 教程](https://cursor101.com/article/cursor-composer) 所述）。

#### 模式对报告的重要性
这些模式是 Cursor 核心功能，定义了从交互式查询到完全自主编码的不同用户体验。加入它们可：
1. 更清晰比较插件是否提供类似交互模式。
2. 评估插件在自主性上的匹配度，尤其与 Cursor 的 Agent Mode 对比。
3. 帮助用户理解插件在 AI 辅助编码中的灵活性和控制水平。

例如，[Continue 文档](https://continue.dev/docs/agent/how-to-use-it) 显示 Continue 有聊天功能和代理模式，类似 Cursor 的 Ask 和 Agent Mode。Cline 作为自主编码代理（如 [Cline GitHub](https://github.com/cline/cline) 所述），更接近 Agent Mode，但缺乏明确聊天功能。Autodev 支持聊天和自动化（如 [Autodev GitHub](https://github.com/unit-mesh/auto-dev)），覆盖部分模式。

#### 功能对比分析
以下表格比较各插件与 Cursor 模式的匹配度：

| **功能/模式**           | **Cursor**                    | **Continue**               | **Cline**                     | **Autodev**                  |
| ----------------------- | ----------------------------- | -------------------------- | ----------------------------- | ---------------------------- |
| 交互式查询（Ask Mode）  | 是（Chat 提问）               | 是（聊天功能）             | 否（无明确聊天）              | 是（聊天功能）               |
| 手动控制（Manual Mode） | 是（建议需手动应用）          | 可能（部分功能需用户确认） | 部分（需批准更改）            | 可能（部分自动化需用户确认） |
| 自主编码（Agent Mode）  | 是（Agent Mode 自主任务完成） | 是（代理模式支持复杂更改） | 是（自主编码代理）            | 可能（自动化功能）           |
| 定制模式（Custom Mode） | 是（用户定义模式）            | 是（开源，可定制）         | 可能（支持多模型和 GUI 控制） | 是（可定制提示）             |

#### 用户体验与集成度
Cursor 的模式提供从低到高自主性的渐进体验，适合不同开发需求。Continue 和 Autodev 因支持多 IDE 和灵活交互，接近 Cursor 的体验。Cline 虽强大但仅限 VSCode，且缺乏交互性，可能不适合需要多样化模式的场景。

#### 结论与建议
鉴于 Cursor 模式的中心作用，建议在报告中新增“交互模式与自主性”部分，详细描述各插件如何匹配 Cursor 的模式。这可提升报告的深度，帮助用户选择适合其工作流的工具。特别关注：
- Continue 因聊天和代理模式最接近 Cursor，推荐优先测试。
- Cline 适合需要高自主性的 VSCode 用户。
- Autodev 可作为备用，需验证功能深度。

#### 关键引用
- [Cursor Agent Mode 文档](https://docs.cursor.com/chat/agent)
- [Cursor Chat 概述](https://docs.cursor.com/chat/overview)
- [Continue 文档](https://continue.dev/docs/agent/how-to-use-it)
- [Cline GitHub 仓库](https://github.com/cline/cline)
- [Autodev GitHub 仓库](https://github.com/unit-mesh/auto-dev)



# Void 对比 Cursor

### 核心要点
- Void 是开源代码编辑器，注重隐私和灵活性；Cursor 是闭源，功能强大但收费。
- Void 支持本地 AI 模型，数据控制更强；Cursor 集成特定 AI，体验更无缝。
- 选择取决于需求：Void 适合注重隐私，Cursor 适合功能优先。

### 对比分析
**概述**  
Void 和 Cursor 都是 AI 驱动的代码编辑器，适合提升开发效率。Void 开源，强调隐私和数据控制；Cursor 闭源，提供更集成化的 AI 体验。

**功能对比**  
| 特征        | Void                       | Cursor                     |
| ----------- | -------------------------- | -------------------------- |
| 开源性      | 是                         | 否                         |
| AI 模型支持 | 支持任意模型，包括本地托管 | 使用 ChatGPT 和 Claude     |
| 数据隐私    | 直接连接 LLM，无中间人     | 默认收集数据，提供隐私模式 |
| 成本        | 免费                       | 每席位 $20                 |

**适用场景**  
- 如果您看重隐私和灵活性，选择 Void。
- 如果您需要强大功能和专业支持，选择 Cursor。

---

### 详细报告
Void 和 Cursor 作为 AI 驱动的代码编辑器，各有特色，适合不同开发者的需求。以下是详细对比，涵盖功能、隐私、成本和适用场景。

#### 基本信息
- **Void**:
  - 开源代码编辑器，由 Mathew Pareles 和 Andrew Pareles 创立，获得 Y Combinator 支持。
  - 是 Visual Studio Code (VS Code) 的分支，继承了 VS Code 的界面和生态系统。
  - 官网：[Void](https://voideditor.com/)。
- **Cursor**:
  - 闭源代码编辑器，由 Anysphere 开发，已获 6000 万美元 Series A 融资。
  - 也是 VS Code 的分支，提供高度集成的 AI 功能。
  - 官网：[Cursor](https://www.cursor.com/en)。

#### 功能对比
以下表格总结了两者的关键功能：

| **特征**        | **Void**                                                     | **Cursor**                                                   |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **开源性**      | 是，开源，允许社区贡献和透明度。                             | 否，闭源，限制自定义和透明度。                               |
| **AI 模型支持** | 支持任意 AI 模型，包括本地托管模型（如 DeepSeek、Llama、Gemini、Qwen）。 | 使用特定模型（如 ChatGPT 和 Claude），灵活性较低。           |
| **数据隐私**    | 直接连接到 LLM（大型语言模型），无中间人，确保数据完全私密。 | 默认收集使用数据和遥测数据，但提供“隐私模式”以避免数据存储和训练。 |
| **基础架构**    | VS Code 的分支，支持一键迁移主题、快捷键和设置。             | VS Code 的分支，但未明确提到迁移支持。                       |
| **AI 工具集成** | 支持 Tab 自动完成、快速编辑、聊天模式（Agent Mode 和 Gather Mode）、LLM 更改检查点、Lint 错误检测、本地工具使用。 | 支持高级自动完成、多行编辑、智能重写、聊天功能（包括代码库查询和网络搜索）。 |
| **Agent Mode**  | 支持任何模型，允许文件管理、终端访问等功能。                 | 未明确提及类似功能，但支持多文件编辑和自动上下文获取。       |
| **Gather Mode** | 仅支持读取和搜索，不允许修改或编辑。                         | 未明确提及类似功能。                                         |
| **社区与开发**  | 每周贡献者会议、早期发布、Discord 社区（[链接](https://discord.gg/RSNjgaugJs)）。 | 作为商业产品，专注于专业支持和更新。                         |
| **成本**        | 免费（开源）。                                               | 收费，基础计划为每席位 $20。                                 |

#### 详细分析
- **开源性与隐私**:
  - Void 的开源特性使其更具透明度和灵活性，开发者可以完全控制代码和数据。直接连接到 LLM 的方式进一步确保了数据隐私，不需要通过任何中介。
  - Cursor 虽然提供“隐私模式”，但默认情况下会收集使用数据，这可能对高度关注隐私的用户来说是个问题。

- **AI 模型与灵活性**:
  - Void 支持广泛的 AI 模型，包括本地托管的开源模型（如 DeepSeek、Llama），这为用户提供了更大的选择范围和控制权。
  - Cursor 专注于特定模型（如 ChatGPT 和 Claude），虽然强大，但缺乏模型选择的灵活性。

- **功能与用户体验**:
  - **Void**:
    - 提供 Agent Mode 和 Gather Mode，前者允许更深入的代码库交互，后者则限制为只读模式。
    - 支持 Lint 错误检测和快速应用更改（即使在 1000 行文件上），适合需要高效编辑的用户。
    - 作为开源项目，用户可以自定义和扩展功能。
  - **Cursor**:
    - 以其强大的自动完成和聊天功能著称，可以处理多行编辑、智能重写和代码生成。
    - 聊天功能支持代码库查询、网络搜索和图像上下文，提供更全面的交互体验。
    - 用户反馈表明，Cursor 的 AI 集成更无缝，感觉像一个“编码伙伴”。

- **社区与支持**:
  - Void 强调社区参与，提供每周会议和 Discord 社区，适合希望参与开发或定制工具的用户。
  - Cursor 作为商业产品，专注于专业支持和定期更新，适合希望获得稳定且高质量支持的用户。

- **成本**:
  - Void 是免费的，这对预算有限的开发者或小团队非常吸引。
  - Cursor 需要付费（每席位 $20），但其商业模式确保了持续的开发和支持。

#### 适用场景
- **选择 Void**:
  - 如果您优先考虑**隐私**、**数据控制**和**AI 模型的灵活性**。
  - 如果您是 VS Code 用户，希望在开源框架下获得类似体验。
  - 如果您愿意参与社区开发并定制工具。
- **选择 Cursor**:
  - 如果您更看重**无缝的 AI 集成**和**全面的功能集**（如多文件编辑、智能重写）。
  - 如果您愿意为专业支持和稳定更新付费。
  - 如果您需要一个更成熟的商业产品，而非社区驱动型工具。

#### 总结
Void 和 Cursor 都是强大的 AI 代码编辑器，但它们在设计理念和目标用户上有所不同。Void 以其开源性质、数据隐私和模型灵活性吸引了注重控制和透明度的开发者，而 Cursor 则以其高度集成的 AI 功能和用户友好性吸引了希望获得更流畅编码体验的用户。最终选择取决于您的具体需求：如果隐私和灵活性是首要考虑，那么 Void 是更好的选择；如果您更看重功能丰富度和专业支持，则 Cursor 可能更适合。

### 关键引文
- [Void 开源 Cursor 替代品 | Hacker News](https://news.ycombinator.com/item?id=43927926)
- [Cursor AI vs Void AI 代码编辑器对比 | DEV Community](https://dev.to/dev007777/cursor-ai-vs-void-ai-code-editor-the-ultimate-showdown-309c)
- [GitHub Void 仓库](https://github.com/voideditor/void)
- [Void 开源 Cursor 替代品 | Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1fjzohj/void_is_an_opensource_cursor_alternative/)
- [Void IDE 全面指南 | Medium](https://medium.com/@adityakumar2001/void-ide-the-comprehensive-guide-to-the-open-source-cursor-alternative-2a6b17cae235)
- [开源 Cursor 替代品 Void | Medium](https://medium.com/vibe-coding/open-source-cursor-alternative-void-3055c1680c88)
- [Void 开源 Cursor 替代品 | Y Combinator](https://www.ycombinator.com/companies/void)
- [Void YC 支持开源 Cursor 替代品 | AIM](https://analyticsindiamag.com/ai-news-updates/meet-void-yc-backed-open-source-cursor-alternative/)
- [Void 开源 Cursor/GitHub Copilot 替代品 | Hacker News](https://news.ycombinator.com/item?id=41563958)
- [Void 官方网站](https://voideditor.com/)
- [Cursor 功能列表](https://www.cursor.com/en/features)
- [Cursor AI 指南及实例 | DataCamp](https://www.datacamp.com/tutorial/cursor-ai-code-editor)
- [Cursor 代码编辑器 | Wikipedia](https://en.wikipedia.org/wiki/Cursor_%28code_editor%29)
- [Cursor 开发者介绍 | Builder](https://www.builder.io/blog/cursor-ai-for-developers)