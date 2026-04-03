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
  return `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`;
}

function getSlugFromLocation() {
  const path = window.location.pathname
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);

  const blogIndex = path.findIndex((segment) => segment === "blog");
  if (blogIndex !== -1) {
    const slugParts = path.slice(blogIndex + 1);
    if (slugParts.length) {
      return decodeURIComponent(slugParts.join("/"));
    }
  }

  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get("slug");
  return querySlug || "";
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

function getBlockTag(style) {
  const allowedTags = new Set([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
  ]);

  return allowedTags.has(style) ? style : "p";
}

function applyMark(text, mark, markDefsByKey) {
  switch (mark) {
    case "strong":
      return `<strong>${text}</strong>`;
    case "em":
      return `<em>${text}</em>`;
    case "underline":
      return `<u>${text}</u>`;
    case "code":
      return `<code>${text}</code>`;
    case "strike-through":
      return `<s>${text}</s>`;
    default: {
      const markDef = markDefsByKey[mark];

      if (markDef?._type === "link" && markDef.href) {
        const href = escapeHtml(String(markDef.href));
        const isExternal = /^https?:\/\//i.test(markDef.href);
        const target = isExternal ? ' target="_blank"' : "";
        const rel = isExternal ? ' rel="noopener noreferrer"' : "";
        return `<a href="${href}"${target}${rel}>${text}</a>`;
      }

      return text;
    }
  }
}

function renderBlockChildren(block) {
  const markDefsByKey = Object.fromEntries(
    (block.markDefs || []).map((markDef) => [markDef._key, markDef])
  );

  return (block.children || [])
    .map((child) => {
      if (!child || child._type !== "span") return "";

      const safeText = escapeHtml(child.text || "").replace(/\n/g, "<br>");
      const marks = Array.isArray(child.marks) ? child.marks : [];

      return marks.reduce(
        (formattedText, mark) =>
          applyMark(formattedText, mark, markDefsByKey),
        safeText
      );
    })
    .join("");
}

function renderPost(post) {
  const fragments = [];
  let openListTag = "";

  (post.body || []).forEach((block) => {
    if (!block || block._type !== "block") return;

    const text = renderBlockChildren(block);
    if (!text.trim()) return;

    if (block.listItem) {
      const listTag = block.listItem === "number" ? "ol" : "ul";

      if (openListTag && openListTag !== listTag) {
        fragments.push(`</${openListTag}>`);
        openListTag = "";
      }

      if (!openListTag) {
        openListTag = listTag;
        fragments.push(`<${listTag}>`);
      }

      fragments.push(`<li>${text}</li>`);
      return;
    }

    if (openListTag) {
      fragments.push(`</${openListTag}>`);
      openListTag = "";
    }

    const tag = getBlockTag(block.style);
    fragments.push(`<${tag}>${text}</${tag}>`);
  });

  if (openListTag) {
    fragments.push(`</${openListTag}>`);
  }

  const content = fragments.join("");

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
  const slug = getSlugFromLocation();

  if (!slug) {
    window.location.href = "/blog";
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
