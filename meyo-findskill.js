document.documentElement.classList.add("js");

const agentPrompt =
  "请安装 meyo-skill-finder 技能：从 https://www.meyo123.com/api/v1/skills/download/public?name=meyo-skill-finder 下载技能压缩包，解压到本地技能目录并启用。";

const cases = {
  content: {
    title: "典型 Query：把产品卖点改写成小红书种草笔记，并生成 5 个标题",
    body:
      "meyo-skill-finder 会从内容风格、平台语气和历史实测产出里召回，优先推荐在真实内容任务中表现稳定的 Skill。",
    rows: [
      ["XHS Content Studio", "平台语气更贴合"],
      ["Hook Title Generator", "标题点击感更强"],
      ["Brand Tone Polisher", "卖点表达更稳定"],
    ],
  },
  finance: {
    title: "典型 Query：分析英伟达最新财报和股价异动，输出投资要点",
    body:
      "meyo-skill-finder 会结合金融数据解析、公告摘要和风险提示的实测结果，筛掉只会泛泛复述行情的 Skill。",
    rows: [
      ["Earnings Insight Skill", "财报结构更清晰"],
      ["Stock Move Explainer", "异动归因更稳"],
      ["Risk Signal Checker", "风险提示更完整"],
    ],
  },
  news: {
    title: "典型 Query：追踪 AI Agent 行业最新新闻，生成带来源的晨报",
    body:
      "meyo-skill-finder 会优先召回在多源检索、去重聚合和引用保真上有真实战绩的 Skill，减少过期和无来源摘要。",
    rows: [
      ["News Radar Skill", "多源覆盖更全"],
      ["Source Verifier", "引用链路清楚"],
      ["Briefing Composer", "晨报结构稳定"],
    ],
  },
};

const demoSkillSets = {
  content: [
    ["XHS Content Studio", "适合小红书种草、标题生成和平台语气改写。"],
    ["Hook Title Generator", "在标题点击感和多版本生成上表现更稳定。"],
    ["Brand Tone Polisher", "适合把产品卖点改成统一品牌口吻。"],
    ["Social Caption Builder", "适合短文案、图文配文和发布说明。"],
    ["Campaign Brief Writer", "适合把零散卖点整理成营销 brief。"],
  ],
  finance: [
    ["Earnings Insight Skill", "最适合财报解析、关键指标提取和投资要点生成。"],
    ["Stock Move Explainer", "适合解释股价异动、新闻催化和市场反应。"],
    ["Risk Signal Checker", "适合补充风险提示、前提条件和不确定性。"],
    ["Financial Table Reader", "适合读取财务表格并提炼同比环比变化。"],
    ["Analyst Note Composer", "适合把分析结果整理成结构化观点。"],
  ],
  news: [
    ["News Radar Skill", "最适合多源检索、去重聚合和持续追踪新闻。"],
    ["Source Verifier", "适合检查来源可靠性并保留引用链路。"],
    ["Briefing Composer", "适合把多条新闻整理成晨报或日报。"],
    ["Trend Timeline Builder", "适合按时间线梳理事件进展。"],
    ["Signal Digest Skill", "适合从噪声新闻里提取关键信号。"],
  ],
  default: [
    ["Task Matcher Pro", "适合先判断任务类型，再选择最合适的执行 Skill。"],
    ["Evidence Collector", "适合需要引用、来源和可验证依据的任务。"],
    ["Result Polisher", "适合把初稿整理成更清晰的最终输出。"],
    ["Workflow Builder", "适合多步骤任务拆解和执行顺序规划。"],
    ["Quality Guard Skill", "适合检查结果是否遗漏条件、边界和风险。"],
  ],
};

const pickDemoSet = (query) => {
  const text = query.toLowerCase();
  if (/小红书|内容|标题|文案|种草|营销|海报|创作/.test(text)) return demoSkillSets.content;
  if (/股票|金融|财报|投资|股价|行情|英伟达|nvda|基金/.test(text)) return demoSkillSets.finance;
  if (/新闻|资讯|晨报|日报|舆情|追踪|热点|来源/.test(text)) return demoSkillSets.news;
  return demoSkillSets.default;
};

const escapeHTML = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const demoForm = document.querySelector("[data-skill-demo]");
const demoResults = document.querySelector("[data-skill-demo-results]");

if (demoForm && demoResults) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(demoForm).get("query").trim();
    const effectiveQuery =
      query || "帮我追踪 AI Agent 行业最新新闻，生成带来源的晨报";
    const rows = pickDemoSet(effectiveQuery);
    demoResults.innerHTML = rows
      .map(
        ([name, reason], index) => `
          <div class="skill-result ${index === 0 ? "best" : ""}">
            <span class="skill-rank">${index + 1}</span>
            <div>
              <strong>${escapeHTML(name)}</strong>
              <p>${escapeHTML(reason)}</p>
            </div>
            ${index === 0 ? '<span class="best-badge">最优推荐</span>' : ""}
          </div>
        `
      )
      .join("");
  });
}

const tabs = document.querySelectorAll(".tab");
const panel = document.querySelector("#casePanel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    const item = cases[tab.dataset.case];
    panel.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <div class="verified-list">
        ${item.rows
          .map(
            ([name, reason]) => `
              <div class="verified-row">
                <span class="ok">✓</span>
                <span>${name}</span>
                <span class="why">${reason}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  });
});

const copyButtons = document.querySelectorAll("[data-copy-agent-prompt]");

const fallbackCopy = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

copyButtons.forEach((copyButton) => {
  copyButton.addEventListener("click", async () => {
    const originalText = copyButton.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(agentPrompt);
      } else {
        fallbackCopy(agentPrompt);
      }
      copyButton.textContent = "已复制，发给Agent";
      copyButton.classList.add("is-copied");
      window.setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.classList.remove("is-copied");
      }, 1800);
    } catch {
      copyButton.textContent = "复制失败，请手动复制";
      window.setTimeout(() => {
        copyButton.textContent = originalText;
      }, 1800);
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
