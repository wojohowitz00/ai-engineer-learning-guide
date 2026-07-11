import { Step } from './types';

export const roadmapData: Step[] = [
  {
    id: 1,
    title: "Close the Software Engineering Gap",
    description: "Move from interactive scripting in notebooks to building robust, modular, production-grade applications with software engineering best practices.",
    topics: [
      {
        id: "step1-1",
        title: "Moving from Jupyter notebooks to structured, multi-file Python projects",
        resources: [
          {
            title: "The Journey from Jupyter to Programmer: A Quick-Start Guide",
            url: "https://towardsdatascience.com/the-journey-from-jupyter-to-programmer-a-quick-start-guide/",
            type: "tutorial",
            platform: "Towards Data Science",
            description: "A data-science-specific walkthrough of breaking a notebook into modular .py files with a proper project template (src/, README, pyproject.toml)."
          },
          {
            title: "Python Application Layouts: A Reference",
            url: "https://realpython.com/python-application-layouts/",
            type: "tutorial",
            platform: "Real Python",
            description: "The canonical guide to structuring Python projects, with concrete folder templates for scripts, packages, and web apps."
          },
          {
            title: "Anatomy of a Scalable Python Project (FastAPI)",
            url: "https://www.youtube.com/watch?v=Af6Zr0tNNdE",
            type: "video",
            platform: "ArjanCodes (YouTube)",
            description: "Shows a clean folder structure, .env config, centralized logging, and tests for a production-style project."
          },
          {
            title: "How to Structure Programming Projects for Beginners",
            url: "https://www.youtube.com/watch?v=3gf60ncxe28",
            type: "video",
            platform: "YouTube",
            description: "Beginner-friendly overview of organizing code into modules/directories beyond single-file scripts."
          },
          {
            title: "Packaging Python Projects",
            url: "https://packaging.python.org/en/latest/tutorials/packaging-projects/",
            type: "docs",
            platform: "PyPA (Python Packaging Authority)",
            description: "The official, current reference for src/ layout and pyproject.toml — covers Hatchling, setuptools, and uv-build backends."
          }
        ]
      },
      {
        id: "step1-2",
        title: "Object-oriented programming (OOP) — classes, imports, modules",
        resources: [
          {
            title: "OOP Learning Path",
            url: "https://realpython.com/learning-paths/object-oriented-programming-oop-python/",
            type: "course",
            platform: "Real Python",
            description: "An 18-resource path from classes/constructors through inheritance, composition, and SOLID principles."
          },
          {
            title: "Python OOP Tutorials – Working with Classes",
            url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
            type: "video",
            platform: "Corey Schafer (YouTube)",
            description: "The widely recommended starting point for classes, instances, and inheritance."
          },
          {
            title: "Python Modules and Packages – An Introduction",
            url: "https://realpython.com/python-modules-packages/",
            type: "tutorial",
            platform: "Real Python",
            description: "Explains import, the module search path, and organizing modules into packages."
          },
          {
            title: "Python Basics: Modules and Packages",
            url: "https://realpython.com/courses/python-basics-modules-packages/",
            type: "course",
            platform: "Real Python",
            description: "A 25-lesson video course with exercises on imports and package structure. Video courses require a Real Python membership.",
            paywall: true
          },
          {
            title: "The Python Tutorial — 9. Classes",
            url: "https://docs.python.org/3/tutorial/classes.html",
            type: "docs",
            platform: "Python Docs",
            description: "Authoritative, free coverage of class definition, inheritance, and scoping/namespaces from the official Python tutorial."
          }
        ]
      },
      {
        id: "step1-3",
        title: "UV — modern dependency management (alternative to pip)",
        resources: [
          {
            title: "uv Official Documentation",
            url: "https://docs.astral.sh/uv/",
            type: "docs",
            platform: "Astral Docs",
            description: "The authoritative reference for uv init/add/run/lock/sync, Python version management, and uvx."
          },
          {
            title: "How to Manage Python Packages with uv",
            url: "https://www.freecodecamp.org/news/how-to-manage-python-packages-with-uv/",
            type: "tutorial",
            platform: "freeCodeCamp",
            description: "Hands-on walkthrough of lockfiles, uv run, and migrating from pip."
          },
          {
            title: "Python uv Tutorial",
            url: "https://www.youtube.com/watch?v=l3IWgp_r2xY",
            type: "video",
            platform: "YouTube",
            description: "A concise full-workflow demo of the uv package manager tool."
          },
          {
            title: "UV Python Package Manager Tutorial 2025 (100x Faster Than Pip)",
            url: "https://www.youtube.com/watch?v=_6l2phhOoSg",
            type: "video",
            platform: "YouTube",
            description: "Positions uv as a single replacement for pip, virtualenv, poetry, and conda."
          }
        ]
      },
      {
        id: "step1-4",
        title: "Git workflows — branching strategies and pull requests",
        resources: [
          {
            title: "Git & GitHub Crash Course for Beginners",
            url: "https://www.freecodecamp.org/news/git-and-github-crash-course-for-beginners/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Covers branching, merging, rebase, and pull requests with real workflows."
          },
          {
            title: "Gitflow Workflow",
            url: "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow",
            type: "tutorial",
            platform: "Atlassian",
            description: "Deep explanation of feature/release/hotfix branching plus trunk-based development context."
          },
          {
            title: "How to Create a Pull Request in 4 Minutes | GitHub for Beginners",
            url: "https://www.youtube.com/watch?v=nCKdihvneS0",
            type: "video",
            platform: "GitHub (YouTube)",
            description: "Directly demonstrates branch → commit → push → PR → review."
          },
          {
            title: "Git and GitHub for Beginners – Crash Course",
            url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
            type: "video",
            platform: "freeCodeCamp (YouTube)",
            description: "The classic, hugely popular full crash course for learning git internals."
          }
        ]
      },
      {
        id: "step1-5",
        title: "Production basics: testing (pytest), debugging, logging, .env config",
        resources: [
          {
            title: "pytest Tutorial: Effective Python Testing",
            url: "https://realpython.com/pytest-python-testing/",
            type: "tutorial",
            platform: "Real Python",
            description: "Fixtures, parametrize, marks, and plugins."
          },
          {
            title: "Logging in Python",
            url: "https://realpython.com/python-logging/",
            type: "tutorial",
            platform: "Real Python",
            description: "Loggers, levels, formatters, handlers — production-grade logging."
          },
          {
            title: "Using the .env File",
            url: "https://realpython.com/videos/using-env-file/",
            type: "video",
            platform: "Real Python",
            description: "Securely managing API keys/secrets with python-dotenv. Video lessons require a Real Python membership.",
            paywall: true
          },
          {
            title: "Testing Your Code With pytest",
            url: "https://realpython.com/courses/testing-your-code-with-pytest/",
            type: "course",
            platform: "Real Python",
            description: "A guided 6-lesson video course reinforcing pytest fundamentals. Video courses require a Real Python membership.",
            paywall: true
          },
          {
            title: "pytest: Get Started",
            url: "https://docs.pytest.org/en/stable/getting-started.html",
            type: "docs",
            platform: "pytest Docs",
            description: "The official, free quick-start: install, first test, assertions, and grouping tests."
          },
          {
            title: "Logging HOWTO",
            url: "https://docs.python.org/3/howto/logging.html",
            type: "docs",
            platform: "Python Docs",
            description: "Official free guide to loggers, handlers, levels, and formatters."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "The LLM-Specific Layer",
    description: "Develop the cognitive mechanics of AI engineering: structuring outputs, advanced prompting techniques, context design, and building custom agents from absolute scratch.",
    topics: [
      {
        id: "step2-1",
        title: "OpenAI Python SDK — API calls, caching, structured outputs",
        resources: [
          {
            title: "Structured Outputs — OpenAI API Guide",
            url: "https://developers.openai.com/api/docs/guides/structured-outputs",
            type: "docs",
            platform: "OpenAI Docs",
            description: "Forcing responses into a strict JSON Schema, including Pydantic integration."
          },
          {
            title: "Prompt Caching — OpenAI API Guide",
            url: "https://developers.openai.com/api/docs/guides/prompt-caching",
            type: "docs",
            platform: "OpenAI Docs",
            description: "How automatic caching cuts latency and cost."
          },
          {
            title: "openai-python (official SDK repo)",
            url: "https://github.com/openai/openai-python",
            type: "repo",
            platform: "GitHub",
            description: "Runnable examples for the Responses API, streaming, async, and typed Pydantic responses."
          },
          {
            title: "OpenAI Structured Output Tutorial (Responses API + JSON Schema)",
            url: "https://www.youtube.com/watch?v=ROKU_Jqb1po",
            type: "video",
            platform: "YouTube",
            description: "Concise walkthrough with code using modern client structure."
          }
        ]
      },
      {
        id: "step2-2",
        title: "Prompt engineering",
        resources: [
          {
            title: "ChatGPT Prompt Engineering for Developers",
            url: "https://www.deeplearning.ai/courses/chatgpt-prompt-eng",
            type: "course",
            platform: "DeepLearning.AI",
            description: "The classic hands-on intro with OpenAI API notebooks by Isa Fulford & Andrew Ng."
          },
          {
            title: "Prompt Engineering Guide",
            url: "https://www.promptingguide.ai/",
            type: "docs",
            platform: "PromptingGuide",
            description: "Comprehensive, regularly updated coverage of zero-shot, few-shot, and chain-of-thought techniques."
          },
          {
            title: "Learn Prompting — Introduction",
            url: "https://learnprompting.org/docs/introduction",
            type: "course",
            platform: "Learn Prompting",
            description: "Free interactive curriculum. Beginner through advanced optimization, used by 3M+ learners."
          },
          {
            title: "Prompt Engineering Tutorial – Master ChatGPT and LLM Responses",
            url: "https://www.youtube.com/watch?v=_ZvnD73m40o",
            type: "video",
            platform: "freeCodeCamp (YouTube)",
            description: "Full tutorial on prompting mindset and optimization workflows."
          },
          {
            title: "Prompt Engineering (official guide)",
            url: "https://developers.openai.com/api/docs/guides/prompt-engineering",
            type: "docs",
            platform: "OpenAI Docs",
            description: "Message roles, few-shot, RAG, and how prompting differs for reasoning vs. GPT models — always free and current."
          }
        ]
      },
      {
        id: "step2-3",
        title: "Building AI agents from scratch (no frameworks)",
        resources: [
          {
            title: "Build an AI Agent from Scratch with Python (No Frameworks)",
            url: "https://alejandro-ao.com/agents-from-scratch/",
            type: "tutorial",
            platform: "Alejandro AO",
            description: "The receive-query → decide-tool → execute → respond loop, no LangChain/LlamaIndex."
          },
          {
            title: "Intro to Agents — Create an Agent from Scratch",
            url: "https://www.youtube.com/watch?v=vHDwpoSFdQY",
            type: "video",
            platform: "Alejandro AO (YouTube)",
            description: "Video companion to the agents from scratch tutorial."
          },
          {
            title: "Build your First AI Agent from Scratch (No Frameworks, Just Python)",
            url: "https://www.youtube.com/watch?v=HkFB0_AcIcg",
            type: "video",
            platform: "YouTube",
            description: "A deliberately framework-free build demonstrating raw execution flows."
          },
          {
            title: "Deep Dive into LLMs like ChatGPT",
            url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
            type: "video",
            platform: "Andrej Karpathy (YouTube)",
            description: "3.5-hour conceptual foundation for how LLMs (and their tool use) actually work."
          }
        ]
      },
      {
        id: "step2-4",
        title: "Context engineering",
        resources: [
          {
            title: "Effective Context Engineering for AI Agents",
            url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
            type: "blog",
            platform: "Anthropic",
            description: "The definitive framing of context engineering as the successor to prompt engineering."
          },
          {
            title: "7 Context Engineering Rules for Production AI Agents",
            url: "https://www.youtube.com/watch?v=wgDzOSPbTqg",
            type: "video",
            platform: "YouTube",
            description: "Practical rules for reliable production agents."
          },
          {
            title: "See How Anthropic Uses Context Engineering",
            url: "https://www.youtube.com/watch?v=EKXClh779H0",
            type: "video",
            platform: "YouTube",
            description: "Accessible explainer of curation, memory, and retrieval strategies."
          },
          {
            title: "Context Engineering Guide: RAG & Agentic AI",
            url: "https://www.sundeepteki.org/blog/context-engineering-a-framework-for-robust-generative-ai-systems",
            type: "blog",
            platform: "Sundeep Teki",
            description: "Framework-style guide covering RAG and agentic patterns."
          },
          {
            title: "Context Engineering for Agents",
            url: "https://www.langchain.com/blog/context-engineering-for-agents",
            type: "blog",
            platform: "LangChain",
            description: "The widely cited write/select/compress/isolate framework — an authoritative complement to the Anthropic post."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Build Production-Ready Backends",
    description: "Build robust, containerized, and secure RESTful backends and custom API interfaces to hook up relational data and serve custom logic.",
    topics: [
      {
        id: "step3-1",
        title: "FastAPI",
        resources: [
          {
            title: "Tutorial - User Guide",
            url: "https://fastapi.tiangolo.com/tutorial/",
            type: "docs",
            platform: "FastAPI Docs",
            description: "The canonical step-by-step guide from the framework's creator."
          },
          {
            title: "Python FastAPI Tutorial: Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=iukOehU5aF4",
            type: "video",
            platform: "Corey Schafer (YouTube)",
            description: "Zero-to-full-stack-app course."
          },
          {
            title: "FastAPI Full Crash Course",
            url: "https://www.youtube.com/watch?v=rvFsGRvj9jo",
            type: "video",
            platform: "NeuralNine (YouTube)",
            description: "Fast-paced crash course for experienced Python devs."
          },
          {
            title: "FastAPI Blog Tutorials",
            url: "https://testdriven.io/blog/topics/fastapi/",
            type: "tutorial",
            platform: "TestDriven.io",
            description: "Production-focused: JWT auth, async SQLAlchemy/SQLModel, testing."
          }
        ]
      },
      {
        id: "step3-2",
        title: "Pydantic",
        resources: [
          {
            title: "Python Pydantic Tutorial: Complete Data Validation Course",
            url: "https://www.youtube.com/watch?v=M81pfi64eeM",
            type: "video",
            platform: "Corey Schafer (YouTube)",
            description: "Model creation, validators, type coercion, nested models."
          },
          {
            title: "Data Validation in Python With Pydantic",
            url: "https://www.youtube.com/watch?v=ySCtmCTm1lE",
            type: "video",
            platform: "Real Python (YouTube)",
            description: "Overview of Python data validation with Pydantic v2."
          },
          {
            title: "Structured Output from LLMs Using Pydantic",
            url: "https://www.youtube.com/watch?v=rjEMU15ZONM",
            type: "video",
            platform: "Code with Felix (YouTube)",
            description: "Directly relevant to enforcing type-safe LLM outputs in software engineering."
          },
          {
            title: "Pydantic Official Documentation",
            url: "https://pydantic.dev/docs/",
            type: "docs",
            platform: "Pydantic Docs",
            description: "Official reference and documentation."
          }
        ]
      },
      {
        id: "step3-3",
        title: "Docker (for Python developers)",
        resources: [
          {
            title: "Python Docker Tutorials",
            url: "https://realpython.com/tutorials/docker/",
            type: "tutorial",
            platform: "Real Python",
            description: "Dockerfiles, docker compose with Postgres/Redis, multi-stage builds."
          },
          {
            title: "Docker Full Course",
            url: "https://www.freecodecamp.org/news/docker-full-course/",
            type: "course",
            platform: "freeCodeCamp",
            description: "7-hour deep dive covering images, networking, volumes, Compose, and Swarm."
          },
          {
            title: "Containerize Your Python Application with Docker: Step-by-Step Tutorial",
            url: "https://www.youtube.com/watch?v=k6D5UyLPNrI",
            type: "video",
            platform: "Coder In Boots (YouTube)",
            description: "Interactive tutorial on containerization for Python scripts and environments."
          },
          {
            title: "A Gentle Introduction to Docker for Python Developers",
            url: "https://www.kdnuggets.com/a-gentle-introduction-to-docker-for-python-developers",
            type: "tutorial",
            platform: "KDnuggets",
            description: "A friendly high-level look at basic Docker terminology and commands."
          },
          {
            title: "Python language-specific guide",
            url: "https://docs.docker.com/guides/python/",
            type: "docs",
            platform: "Docker Docs",
            description: "Official, current guide: containerize → develop → test → CI for a Python app, fully free."
          }
        ]
      },
      {
        id: "step3-4",
        title: "PostgreSQL",
        resources: [
          {
            title: "Part I. Tutorial (Official PostgreSQL Docs)",
            url: "https://www.postgresql.org/docs/current/tutorial.html",
            type: "docs",
            platform: "PostgreSQL Docs",
            description: "Installation through queries, joins, transactions, and views."
          },
          {
            title: "PostgreSQL Course for Beginners",
            url: "https://www.freecodecamp.org/news/posgresql-course-for-beginners/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Setup with pgAdmin through aggregates and challenges."
          },
          {
            title: "PostgreSQL Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=SpfIwlAYaKk",
            type: "video",
            platform: "freeCodeCamp (YouTube)",
            description: "Extensive tutorial showing direct database installation, configuration, and SQL query creation."
          },
          {
            title: "Building a Database Application With PostgreSQL & Python",
            url: "https://www.youtube.com/watch?v=Yh0uwzQ-TrE",
            type: "video",
            platform: "Drez (YouTube)",
            description: "Connecting Python to Postgres for a real app."
          }
        ]
      },
      {
        id: "step3-5",
        title: "Model Context Protocol (MCP) servers",
        resources: [
          {
            title: "Build an MCP Server",
            url: "https://modelcontextprotocol.io/docs/develop/build-server",
            type: "docs",
            platform: "Model Context Protocol",
            description: "The authoritative Anthropic-backed guide with Python examples."
          },
          {
            title: "Learn MCP Essentials and How to Create Secure Agent Interfaces with FastMCP",
            url: "https://www.freecodecamp.org/news/learn-mcp-essentials-and-how-to-create-secure-agent-interfaces-with-fastmcp/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Three hands-on FastMCP projects."
          },
          {
            title: "MCP Tutorial: Build Your First MCP Server and Client from Scratch",
            url: "https://www.youtube.com/watch?v=RhTiAOGwbYE",
            type: "video",
            platform: "KodeKloud (YouTube)",
            description: "Includes a free hands-on lab and multi-step walkthrough."
          },
          {
            title: "Model Context Protocol (MCP) Tutorial: Build Your First MCP Server in 6 Steps",
            url: "https://towardsdatascience.com/model-context-protocol-mcp-tutorial-build-your-first-mcp-server-in-6-steps/",
            type: "tutorial",
            platform: "Towards Data Science",
            description: "Data-science-oriented, uses FastMCP + Claude Desktop."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Retrieval-Augmented Generation (RAG)",
    description: "Understand the backbone of production knowledge systems: text chunking strategies, embeddings APIs, vector retrieval, and native database search extensions.",
    topics: [
      {
        id: "step4-1",
        title: "RAG fundamentals and pipeline design",
        resources: [
          {
            title: "Learn RAG from Scratch – Python AI Tutorial from a LangChain Engineer",
            url: "https://www.freecodecamp.org/news/mastering-rag-from-scratch/",
            type: "course",
            platform: "freeCodeCamp",
            description: "~2.5 hours covering indexing, multi-query, RAG-Fusion, HyDE, routing, RAPTOR, CRAG, and Adaptive RAG by Lance Martin."
          },
          {
            title: "RAG 101: Learn how to build your first pipeline!",
            url: "https://www.youtube.com/watch?v=QTK55_Otbqs",
            type: "video",
            platform: "DataCamp (YouTube)",
            description: "End-to-end pipeline build with Python and LangChain."
          },
          {
            title: "Retrieval Augmented Generation (RAG)",
            url: "https://www.deeplearning.ai/courses/retrieval-augmented-generation",
            type: "course",
            platform: "DeepLearning.AI",
            description: "26-hour full course: architecture, retrieval methods, chunking, evaluation. Only Module 1 is a free preview; full access requires paid enrollment.",
            paywall: true
          },
          {
            title: "Building and Evaluating Advanced RAG Applications",
            url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
            type: "course",
            platform: "DeepLearning.AI",
            description: "Free ~2-hour short course by Jerry Liu (LlamaIndex CEO) on advanced retrieval and RAG evaluation."
          },
          {
            title: "Learn RAG & MCP Fundamentals",
            url: "https://www.freecodecamp.org/news/learn-rag-and-mcp-fundamentals/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Documents → embeddings → vector DB (Chroma), and the 'precision problem'."
          }
        ]
      },
      {
        id: "step4-2",
        title: "Chunking strategies",
        resources: [
          {
            title: "Chunking Strategies for LLM Applications",
            url: "https://www.pinecone.io/learn/chunking-strategies/",
            type: "tutorial",
            platform: "Pinecone",
            description: "Fixed-size, semantic, recursive, and LLM-contextual chunking, plus how to evaluate chunk size choices."
          },
          {
            title: "Document Chunking Strategies for RAG Systems: Complete Python Tutorial",
            url: "https://www.youtube.com/watch?v=yrLe3UAR1PU",
            type: "video",
            platform: "YouTube",
            description: "Fixed-size vs. semantic chunking with code (GitHub included)."
          },
          {
            title: "Semantic Chunking for Improved RAG Results",
            url: "https://www.youtube.com/watch?v=FPYtGK6HYRg",
            type: "video",
            platform: "YouTube",
            description: "LangChain's SemanticChunker in action."
          },
          {
            title: "LangChain Text Splitters (Chunking) for Beginners – 6 Examples",
            url: "https://www.youtube.com/watch?v=Io43kf0hYn4",
            type: "video",
            platform: "YouTube",
            description: "Overview of character splitters, recursive separators, and custom chunk tokens."
          }
        ]
      },
      {
        id: "step4-3",
        title: "Generating embeddings via API & embedding models",
        resources: [
          {
            title: "Vector embeddings (Embeddings guide)",
            url: "https://developers.openai.com/api/docs/guides/embeddings",
            type: "docs",
            platform: "OpenAI Docs",
            description: "How to call the embeddings API, model choice, dimensions parameter."
          },
          {
            title: "Embedding Models: from Architecture to Implementation",
            url: "https://www.deeplearning.ai/courses/embedding-models-from-architecture-to-implementation",
            type: "course",
            platform: "DeepLearning.AI",
            description: "Word/sentence/cross-encoder embeddings, BERT, dual-encoder architectures. (Free to audit)."
          },
          {
            title: "What is a Vector Database? Powering Semantic Search & AI Applications",
            url: "https://www.youtube.com/watch?v=gl1r1XV0SLw",
            type: "video",
            platform: "IBM Technology (YouTube)",
            description: "Covers how embedding models are trained and vector queries."
          },
          {
            title: "Understanding Embedding Models",
            url: "https://www.youtube.com/watch?v=qJp8ZDxS1xQ",
            type: "video",
            platform: "TensorTeach (YouTube)",
            description: "Encoder-only transformers, contrastive learning, tokenization, pooling."
          },
          {
            title: "Sentence Transformers (SBERT) Documentation",
            url: "https://www.sbert.net/",
            type: "docs",
            platform: "SBERT Docs",
            description: "The canonical open-source reference for local embedding models: semantic search, retrieve-and-rerank, cross-encoders, fine-tuning."
          }
        ]
      },
      {
        id: "step4-4",
        title: "Vector storage and retrieval methods",
        resources: [
          {
            title: "What is a Vector Database & How Does it Work?",
            url: "https://www.pinecone.io/learn/vector-database/",
            type: "tutorial",
            platform: "Pinecone",
            description: "Indexing → querying → post-processing pipeline, ANN algorithms (PQ, LSH, HNSW)."
          },
          {
            title: "How Vector Databases Power AI",
            url: "https://www.youtube.com/watch?v=aExSNbSC1f8",
            type: "video",
            platform: "YouTube",
            description: "Explores index construction and high-dimensional vector search basics."
          },
          {
            title: "Mastering Vector Databases with Pinecone",
            url: "https://www.datacamp.com/tutorial/mastering-vector-databases-with-pinecone-tutorial",
            type: "tutorial",
            platform: "DataCamp",
            description: "Step-by-step introduction to vector DB concepts. Caution: from 2023 — its code uses the pre-v3 pinecone.init() API that no longer runs; read for concepts, use the official quickstart for working code."
          },
          {
            title: "Pinecone Quickstart",
            url: "https://docs.pinecone.io/guides/get-started/quickstart",
            type: "docs",
            platform: "Pinecone Docs",
            description: "Official quickstart with current SDK patterns (Pinecone class, serverless indexes) and a free Starter tier."
          }
        ]
      },
      {
        id: "step4-5",
        title: "PostgreSQL + pgvector",
        resources: [
          {
            title: "pgvector (official README)",
            url: "https://github.com/pgvector/pgvector",
            type: "repo",
            platform: "GitHub",
            description: "Enabling the extension, distance operators, HNSW/IVFFlat indexes."
          },
          {
            title: "pgvector Tutorial: Integrate Vector Search into PostgreSQL",
            url: "https://www.datacamp.com/tutorial/pgvector-tutorial",
            type: "tutorial",
            platform: "DataCamp",
            description: "Installation through a sample OpenAI-powered application."
          },
          {
            title: "PGVector: Turn PostgreSQL Into A Vector Database",
            url: "https://www.youtube.com/watch?v=j1QcPSLj7u0",
            type: "video",
            platform: "NeuralNine (YouTube)",
            description: "Building a recommender system end-to-end with SQL."
          },
          {
            title: "PostgreSQL pgvector for Python developers: Practical Guide",
            url: "https://www.youtube.com/watch?v=PuHP3kktmQI",
            type: "video",
            platform: "YouTube",
            description: "Practical guide to using pgvector in Python scripts."
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Observability and Evaluations (Evals)",
    description: "Build robust tracking and evaluation pipelines. Measure LLM application latency, run rules-based regression tests, and apply automated guardrails.",
    topics: [
      {
        id: "step5-1",
        title: "Langfuse — tracking inputs, outputs, latency, and cost",
        resources: [
          {
            title: "10 min Walkthrough of Langfuse",
            url: "https://www.youtube.com/watch?v=2E8iTvGo9Hs",
            type: "video",
            platform: "Langfuse (YouTube)",
            description: "Official walkthrough of the open-source LLM engineering platform."
          },
          {
            title: "Get Started with Tracing",
            url: "https://langfuse.com/docs/observability/get-started",
            type: "docs",
            platform: "Langfuse Docs",
            description: "Drop-in integrations for OpenAI SDK, LangChain, and OpenTelemetry."
          },
          {
            title: "LLM Observability & Application Tracing — Overview",
            url: "https://langfuse.com/docs/observability/overview",
            type: "docs",
            platform: "Langfuse Docs",
            description: "Conceptual reference detailing structured system logs and traces."
          },
          {
            title: "Get Started with Langfuse — Open-Source LLM Monitoring",
            url: "https://www.youtube.com/watch?v=epnPfe5am3I",
            type: "video",
            platform: "Datalumina (YouTube)",
            description: "Self-hosting Langfuse locally."
          }
        ]
      },
      {
        id: "step5-2",
        title: "Building evaluation datasets & regression testing",
        resources: [
          {
            title: "Automated Testing for LLMOps",
            url: "https://www.deeplearning.ai/courses/automated-testing-llmops",
            type: "course",
            platform: "DeepLearning.AI",
            description: "CI workflow running rules-based and model-graded evals. (Free during beta)."
          },
          {
            title: "How to create LLM test datasets with synthetic data",
            url: "https://www.evidentlyai.com/llm-guide/llm-test-dataset-synthetic-data",
            type: "blog",
            platform: "Evidently AI",
            description: "Structured guide showing how to create robust synthetic evaluation sheets."
          },
          {
            title: "LLM evaluation datasets: test cases and synthetic data",
            url: "https://www.youtube.com/watch?v=Do6KAkutKbc",
            type: "video",
            platform: "Evidently AI (YouTube)",
            description: "Best practices and strategies for building target evaluation criteria."
          },
          {
            title: "Promptfoo: Getting Started",
            url: "https://www.promptfoo.dev/docs/intro/",
            type: "docs",
            platform: "Promptfoo Docs",
            description: "Open-source, vendor-neutral CLI/library for declarative LLM test cases and regression evals in CI. (Replaces the deprecated OpenAI Evals framework, whose hosted successor shuts down Nov 2026.)"
          }
        ]
      },
      {
        id: "step5-3",
        title: "\"LLM-as-a-judge\" workflows",
        resources: [
          {
            title: "LLM-as-a-judge: a complete guide",
            url: "https://www.evidentlyai.com/llm-guide/llm-as-a-judge",
            type: "blog",
            platform: "Evidently AI",
            description: "Pairwise vs. direct scoring, judge biases, prompt-writing best practices."
          },
          {
            title: "LLM-as-a-judge: evaluating LLMs with LLMs",
            url: "https://www.youtube.com/watch?v=Qj3u_kzfJVo",
            type: "video",
            platform: "Evidently AI (YouTube)",
            description: "Explores grading models with prompt criteria, evaluating consistency, and bias."
          },
          {
            title: "Evaluating AI Agents",
            url: "https://www.deeplearning.ai/courses/evaluating-ai-agents",
            type: "course",
            platform: "DeepLearning.AI",
            description: "Choosing evaluators and improving your judge iteratively. (Free to audit)."
          },
          {
            title: "LLM-as-Judge: Automated AI Evaluation Explained",
            url: "https://www.youtube.com/watch?v=XJeKSAXFRCk",
            type: "video",
            platform: "YouTube",
            description: "Rubric design and bias mitigation."
          }
        ]
      },
      {
        id: "step5-4",
        title: "Guardrails — prompt injection, PII, output validation",
        resources: [
          {
            title: "Safe and Reliable AI via Guardrails",
            url: "https://www.deeplearning.ai/courses/safe-and-reliable-ai-via-guardrails",
            type: "course",
            platform: "DeepLearning.AI",
            description: "By Shreya Rajpal, Guardrails AI CEO. (Free to audit during beta)."
          },
          {
            title: "LLM Guardrails: Hallucination, Toxicity, PII, and Prompt Injection",
            url: "https://www.youtube.com/watch?v=qP5tBuRBnhM",
            type: "video",
            platform: "StackLessons (YouTube)",
            description: "Core conceptual intro to the parameters of LLM guardrails."
          },
          {
            title: "Guardrails for LLM Applications — Complete Tutorial",
            url: "https://www.youtube.com/watch?v=7V1w5gnZ-kw",
            type: "video",
            platform: "YouTube",
            description: "Hands-on with the Guardrails AI library and validation setups."
          },
          {
            title: "How to validate LLM responses continuously in real time",
            url: "https://guardrailsai.com/blog/validate-llm-responses-real-time",
            type: "blog",
            platform: "Guardrails AI",
            description: "Ensuring output compliance by wrapping prompt handlers. From Jan 2024 — treat as background; see the current docs for up-to-date APIs."
          },
          {
            title: "OWASP Top 10 for LLM Applications (2025)",
            url: "https://genai.owasp.org/llm-top-10/",
            type: "docs",
            platform: "OWASP",
            description: "The authoritative, framework-neutral standard for prompt injection (LLM01), sensitive-information disclosure (LLM02), and the rest of the LLM risk landscape."
          },
          {
            title: "Guardrails AI Official Documentation",
            url: "https://www.guardrailsai.com/docs",
            type: "docs",
            platform: "Guardrails AI Docs",
            description: "Current docs for Guards, validators, and the Guardrails Hub — the up-to-date counterpart to the 2024-era course and blog post."
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Build and Ship Full-Stack Projects",
    description: "Consolidate your knowledge into end-to-end full-stack applications. Ingest and schedule summaries, build chat interfaces, and deploy your code to production systems.",
    topics: [
      {
        id: "step6-1",
        title: "Automated backend pipeline (ingest → email summary, scheduling)",
        resources: [
          {
            title: "How to Automate Work Using Python",
            url: "https://www.freecodecamp.org/news/how-to-automate-things-using-python/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Includes a Hacker News/news-summarizer emailer project."
          },
          {
            title: "Python Email Automation – 6 Real-World Projects",
            url: "https://www.youtube.com/watch?v=YBYiA51YhFQ",
            type: "video",
            platform: "YouTube",
            description: "smtplib, schedule, and Gmail App Passwords walkthrough."
          },
          {
            title: "Automate Data Jobs with Cron & Python Easily",
            url: "https://www.youtube.com/watch?v=o425kNX8CyE",
            type: "video",
            platform: "YouTube",
            description: "Scheduling scripts unattended on a server."
          },
          {
            title: "How to Use Python Schedule Library for Task Automation",
            url: "https://medium.com/@sachinchauhanpy/how-to-use-python-schedule-library-for-task-automation-beginners-guide-with-examples-1c6969e75f2f",
            type: "blog",
            platform: "Medium",
            description: "Comprehensive scheduler setup with code examples."
          }
        ]
      },
      {
        id: "step6-2",
        title: "Basic front-end for a chat UI (Streamlit / Gradio)",
        resources: [
          {
            title: "Build a basic LLM chat app",
            url: "https://docs.streamlit.io/develop/tutorials/chat-and-llm-apps/build-conversational-apps",
            type: "docs",
            platform: "Streamlit Docs",
            description: "Official guide to build interactive chat in Streamlit."
          },
          {
            title: "Build a Streamlit Chatbot FAST",
            url: "https://www.youtube.com/watch?v=sBhK-2K9bUc",
            type: "video",
            platform: "YouTube",
            description: "Fast paced Streamlit tutorial with conversation history."
          },
          {
            title: "Creating A Chatbot Fast",
            url: "https://www.gradio.app/guides/creating-a-chatbot-fast",
            type: "docs",
            platform: "Gradio Docs",
            description: "gr.ChatInterface() with streaming and history."
          },
          {
            title: "Build a Chatbot with Python, Gradio, LangChain and OpenAI",
            url: "https://www.youtube.com/watch?v=AevVRlg6dsc",
            type: "video",
            platform: "YouTube",
            description: "Integrating Gradio UI with LangChain orchestration."
          }
        ]
      },
      {
        id: "step6-3",
        title: "Full-stack chat application (UI + backend + database + auth)",
        resources: [
          {
            title: "MERN Stack Project: Realtime Chat App Tutorial",
            url: "https://www.youtube.com/watch?v=ntKkVrQqBYY",
            type: "video",
            platform: "YouTube",
            description: "~4.5 hours: React, Node/Express, MongoDB, JWT auth, Socket.io, free deployment."
          },
          {
            title: "How to Build a Full Stack Application Using ChatGPT",
            url: "https://www.freecodecamp.org/news/build-a-full-stack-application-using-chatgpt/",
            type: "course",
            platform: "freeCodeCamp",
            description: "Guided full-stack developer workflow with AI assistance."
          },
          {
            title: "How to Build a Full-Stack Authentication App With React, Express, MongoDB",
            url: "https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/",
            type: "tutorial",
            platform: "freeCodeCamp",
            description: "Focused specifically on the full-stack user authentication layer (bcrypt, JWT, protected routes). Note: its Heroku free-tier deployment section is defunct (tier discontinued 2022) — deploy to Render/Railway instead."
          },
          {
            title: "Building a Full-Stack Chatbot App | React + Node.js + MongoDB",
            url: "https://www.youtube.com/watch?v=x_-TbwsPnAA",
            type: "video",
            platform: "YouTube",
            description: "Complete database integration and client message rendering tutorial."
          },
          {
            title: "Vercel AI Chatbot (template)",
            url: "https://github.com/vercel/ai-chatbot",
            type: "repo",
            platform: "GitHub",
            description: "Production-grade LLM-native full-stack reference: Next.js + AI SDK token streaming, Auth.js authentication, Postgres chat-history persistence, multi-provider models."
          }
        ]
      },
      {
        id: "step6-4",
        title: "Deployment — VPS or free-tier cloud",
        resources: [
          {
            title: "How To Serve Flask Applications with Gunicorn and Nginx on Ubuntu 22.04",
            url: "https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-22-04",
            type: "tutorial",
            platform: "DigitalOcean",
            description: "Core VPS deployment skill set with Let's Encrypt SSL."
          },
          {
            title: "How to Deploy a MERN Stack Notes App on AWS",
            url: "https://www.freecodecamp.org/news/how-to-deploy-mern-stack-notes-app-aws/",
            type: "tutorial",
            platform: "freeCodeCamp",
            description: "EC2 + RDS Postgres + S3/CloudFront on the AWS Free Tier."
          },
          {
            title: "Host Python Web Apps FOR FREE (Flask, Django, FastAPI)",
            url: "https://www.youtube.com/watch?v=grUCtaAiUd0",
            type: "video",
            platform: "YouTube",
            description: "Zero-cost deployment via Render.com and Docker."
          },
          {
            title: "Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu",
            url: "https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu",
            type: "tutorial",
            platform: "DigitalOcean",
            description: "Setup of standard server software and configurations."
          }
        ]
      }
    ]
  }
];
