const CONFIG = {
  projectId: "fkbhvjqb",
  dataset: "production",
  apiVersion: "2021-10-21",
};

const SITE_ORIGIN = window.location.origin || "https://maksab-ksa.com";
const FALLBACK_IMAGE = `${SITE_ORIGIN}/images/logo.png`;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toAbsoluteUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_ORIGIN}/${String(url).replace(/^\/+/, "")}`;
}

function getCanonicalUrl(slug) {
  return `${SITE_ORIGIN}/single-post?slug=${encodeURIComponent(slug)}`;
}

function setMetaByName(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);

  if (!content) {
    if (tag) tag.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);

  if (!content) {
    if (tag) tag.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function getBodyText(body) {
  if (!Array.isArray(body)) return "";

  return body
    .filter((block) => block && block._type === "block")
    .map((block) =>
      (block.children || [])
        .map((child) => (child && child.text ? String(child.text) : ""))
        .join(" ")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDescription(post) {
  if (post?.seo?.metaDescription) return String(post.seo.metaDescription).trim();
  if (post?.excerpt) return String(post.excerpt).trim();

  const bodyText = getBodyText(post?.body);
  if (!bodyText) return "Read this article on Maksab blog.";
  return bodyText.slice(0, 160);
}

function setArticleJsonLd(post, canonicalUrl, description, imageUrl) {
  const publishedTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;
  const modifiedTime = post._updatedAt
    ? new Date(post._updatedAt).toISOString()
    : publishedTime;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title || "Maksab Article",
    description,
    image: [imageUrl],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Organization",
      name: "Maksab",
    },
    publisher: {
      "@type": "Organization",
      name: "Maksab",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/images/logo.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
  };

  let script = document.querySelector(
    'script[type="application/ld+json"][data-post-schema="article"]'
  );

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-post-schema", "article");
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

function updateSEO(post, slug) {
  const title = post?.seo?.metaTitle
    ? String(post.seo.metaTitle).trim()
    : `${post.title || "Article"} | Maksab`;

  const description = getDescription(post);
  const imageUrl = toAbsoluteUrl(post.imageUrl);
  const canonicalUrl = getCanonicalUrl(slug);
  const keywords = Array.isArray(post?.seo?.keywords)
    ? post.seo.keywords.join(", ")
    : post?.seo?.keywords;

  document.title = title;
  setCanonical(canonicalUrl);

  setMetaByName("description", description);
  setMetaByName("keywords", keywords ? String(keywords) : "");
  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:title", title);
  setMetaByName("twitter:description", description);
  setMetaByName("twitter:image", imageUrl);
  setMetaByName(
    "twitter:image:alt",
    post.imageAlt ? String(post.imageAlt) : post.title || "Maksab article"
  );

  setMetaByProperty("og:type", "article");
  setMetaByProperty("og:site_name", "Maksab");
  setMetaByProperty("og:title", title);
  setMetaByProperty("og:description", description);
  setMetaByProperty("og:image", imageUrl);
  setMetaByProperty("og:url", canonicalUrl);

  if (post.publishedAt) {
    setMetaByProperty(
      "article:published_time",
      new Date(post.publishedAt).toISOString()
    );
  } else {
    setMetaByProperty("article:published_time", "");
  }

  if (post._updatedAt || post.publishedAt) {
    setMetaByProperty(
      "article:modified_time",
      new Date(post._updatedAt || post.publishedAt).toISOString()
    );
  } else {
    setMetaByProperty("article:modified_time", "");
  }

  setArticleJsonLd(post, canonicalUrl, description, imageUrl);
}

function renderPost(post) {
  const content =
    post.body
      ?.map((block) => {
        if (!block || block._type !== "block") return "";

        const tag = block.style === "h2" ? "h2" : "p";
        const text = (block.children || [])
          .map((child) => escapeHtml(child?.text || ""))
          .join("");

        return `<${tag}>${text}</${tag}>`;
      })
      .join("") || "";

  const title = escapeHtml(post.title || "Article");
  const imageUrl = escapeHtml(post.imageUrl || FALLBACK_IMAGE);
  const imageAlt = escapeHtml(post.imageAlt || post.title || "Article image");

  const html = `
        <article class="article-wrapper">
            <div class="article-body">
                <h1 class="article-title">${title}</h1>
                <div class="article-text">${content}</div>
            </div>
            
            <div class="article-hero">
                <img src="${imageUrl}" alt="${imageAlt}">
            </div>
        </article>
    `;

  document.getElementById("post-content").innerHTML = html;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    window.location.href = "blog";
    return;
  }

  const safeSlug = String(slug)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  const query = encodeURIComponent(`*[_type == "post" && slug.current == "${safeSlug}"][0]{
        title,
        excerpt,
        publishedAt,
        _updatedAt,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        body,
        seo
    }`);

  const url = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/query/${CONFIG.dataset}?query=${query}`;

  try {
    const res = await fetch(url);
    const { result } = await res.json();

    if (result) {
      updateSEO(result, slug);
      renderPost(result);
      return;
    }

    document.getElementById("post-content").innerHTML =
      "<h2 style='color:white; text-align:center; margin-top:50px;'>Post not found.</h2>";
  } catch (err) {
    console.error("Fetch Error:", err);
    document.getElementById("post-content").innerHTML =
      "<h2 style='color:white; text-align:center; margin-top:50px;'>Unable to load this article now.</h2>";
  }
}

init();
