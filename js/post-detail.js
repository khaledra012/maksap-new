const CONFIG = {
  projectId: "fkbhvjqb",
  dataset: "production",
  apiVersion: "2021-10-21",
};

async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) return (window.location.href = "blog.html");

  const QUERY = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
        title,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        body,
        seo
    }`);

  const url = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/query/${CONFIG.dataset}?query=${QUERY}`;

  try {
    const res = await fetch(url);
    const { result } = await res.json();

    if (result) {
      updateSEO(result);
      renderPost(result);
    } else {
      document.getElementById("post-content").innerHTML =
        "<h2 style='color:white; text-align:center; margin-top:50px;'>المقال غير موجود!</h2>";
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

function updateSEO(post) {
  if (post.seo && post.seo.metaTitle) {
      document.title = post.seo.metaTitle;
  } else {
      document.title = post.title + " | مكسب";
  }

  const setMeta = (name, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  setMeta("description", post.seo?.metaDescription);
  setMeta("keywords", post.seo?.keywords);
}

function renderPost(post) {
  // تم حذف سطر تعريف الـ date من هنا

  const content = post.body?.map((block) => {
        if (block._type === "block") {
          const tag = block.style === "h2" ? "h2" : "p";
          const text = block.children.map((c) => c.text).join("");
          return `<${tag}>${text}</${tag}>`;
        }
        return "";
      }).join("") || "";

  const html = `
        <article class="article-wrapper">
            <div class="article-body">
                <h1 class="article-title">${post.title}</h1>
                <div class="article-text">${content}</div>
            </div>
            
            <div class="article-hero">
                <img src="${post.imageUrl}" alt="${post.imageAlt || post.title}">
            </div>
        </article>
    `;

  document.getElementById("post-content").innerHTML = html;
}

init();