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
