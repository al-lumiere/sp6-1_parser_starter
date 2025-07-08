// @todo: напишите здесь код парсера

function parsePage() {
  let meta = {};

  let [title, desc] = document.title.split("—");
  meta.title = title.trim();

  let description = document.querySelector('meta[name="description"]');
  meta.description = description.getAttribute("content");

  let keywords = document.querySelector('meta[name="keywords"]');
  meta.keywords = keywords
    .getAttribute("content")
    .split(",")
    .map((word) => word.trim());

  meta.language = document.documentElement.getAttribute("lang");

  let og = Array.from(document.querySelectorAll('meta[property^="og:"]'));
  meta.opengraph = {};
  og.forEach((tag) => {
    const property = tag.getAttribute("property");
    const content = tag.getAttribute("content");
    const key = property.replace("og:", "");

    meta.opengraph[key] = content;
    meta.opengraph.title = document.title.split(' — ')[0];
  });

  // Продукт теперь

  let product = {};
  let domProduct = document.querySelector(".product");

  product.id = domProduct.dataset.id;
  product.name = domProduct.querySelector(".title").textContent;
  product.isLiked = domProduct
    .querySelector(".like")
    .classList.contains(".active");

  let allTags = Array.from(domProduct.querySelector(".tags").children);
  product.tags = {};
  allTags.forEach((tag) => {
    let key = "";
    if (tag.className === "green") {
      key = "category";
    } else if (tag.className === "blue") {
      key = "label";
    } else if (tag.className === "red") {
      key = "discount";
    }

    let value = tag.textContent.trim();
    if (!product.tags[key]) {
      product.tags[key] = [];
    }

    product.tags[key].push(value);
  });

  product.price = Number(domProduct
    .querySelector(".price")
    .childNodes[0].textContent.trim()
    .replace(/^\D+/, ""));
  product.oldPrice = Number(domProduct
    .querySelector(".price")
    .childNodes[1].textContent.trim()
    .replace(/^\D+/, ""));

  if (product.price === product.oldPrice) {
    product.discount = "0";
  } else {
    product.discount = product.oldPrice - product.price;
  }

  if (product.discount !== "0") {
    product.discountPercent = `${(
      100 - (product.price * 100) / product.oldPrice).toFixed(2)
    }%`;
  } else {
    product.discountPercent = "0%";
  }

  let cur = domProduct.querySelector(".price").childNodes[0].textContent.trim();
  let curr = cur[0];
  if (curr === "$") {
    product.currency = "USD";
  } else if (curr === "€") {
    product.currency = "EUR";
  } else {
    product.currency = "RUB";
  }

  let allProrerties = Array.from(
    domProduct.querySelector(".properties").children
  );
  product.properties = {};
  allProrerties.forEach((item) => {
    const spans = item.querySelectorAll("span");
    const key = spans[0].textContent.trim();
    const value = spans[1].textContent.trim();

    product.properties[key] = value;
  });

  product.description = domProduct
    .querySelector(".description")
    .innerHTML.trim()
    .replace(' class="unused"', "")
    ;

  let allPic = Array.from(domProduct.querySelector("nav").children);
  product.images = [];
  allPic.forEach((img) => {
    let image = img.querySelector("img");

    let preview = image.getAttribute("src");
    let full = image.dataset.src;
    let alt = image.getAttribute("alt");

    product.images.push({
      preview: preview,
      full: full,
      alt: alt,
    });
  });

  // Теперь suggested

  let suggested = [];
  let domSuggested = Array.from(
    document.querySelector(".suggested").querySelector(".items").children
  );

  domSuggested.forEach((art) => {
    let name = art.querySelector("h3").textContent.trim();
    let description = art.querySelector("p").textContent.trim();
    let image = art.querySelector("img").getAttribute("src");
    let fullprice = art.querySelector("b").textContent.trim();
    let price = fullprice.replace(/^\D+/, "");
    let currency = "";
    let curr = fullprice[0];
    if (curr === "$") {
      currency = "USD";
    } else if (curr === "€") {
      currency = "EUR";
    } else {
      currency = "RUB";
    }

    suggested.push({
      name: name,
      description: description,
      image: image,
      price: price,
      currency: currency,
    });
  });

  // Теперь reviews

  let reviews = [];
  let domReviews = Array.from(
    document.querySelector(".reviews").querySelector(".items").children
  );

  domReviews.forEach((art) => {
    const countStars = art.querySelectorAll("span");
    let rating = 0;
    for (let star of countStars) {
      if (star.classList.contains("filled")) {
        rating += 1;
      }
    }

    let avatar = art
      .querySelector(".author")
      .querySelector("img")
      .getAttribute("src");
    let name = art
      .querySelector(".author")
      .querySelector("span")
      .textContent.trim();
    let title = art.querySelector(".title").textContent.trim();
    let description = art.querySelector("p").textContent.trim();
    let date = art.querySelector("i").textContent.trim().replaceAll("/", ".");

    reviews.push({
      rating: rating,
      author: { avatar, name },
      title: title,
      description: description,
      date: date,
    });
  });

  return {
    meta,
    product,
    suggested,
    reviews,
  };
}

window.parsePage = parsePage;
