const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce(
    (value, currentValue) => (value = value + currentValue.likes),
    0
  );
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((value, currentValue) => {
    if (Object.keys(value).length === 0) {
      value = currentValue;
    }
    if (value.likes && value.likes < currentValue.likes) {
      value = currentValue;
    }
    return value;
  }, {});
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const author = blogs.reduce((value, currentValue) => {
    value[currentValue.author] = value[currentValue.author]
      ? ++value[currentValue.author]
      : 1;
    return value;
  }, {});
  const result = {};
  for (key in author) {
    if (Object.keys(result).length === 0) {
      result.blogs = author[key];
      result.author = key;
    } else {
      if (result.blogs < author[key]) {
        result.blogs = author[key];
        result.author = key;
      }
    }
  }
  return result;
};

const mostLikes = (blogs) => {
  const author = blogs.reduce((value, currentValue) => {
    value[currentValue.author] = value[currentValue.author]
      ? value[currentValue.author] + currentValue.likes
      : currentValue.likes;
    return value;
  }, {});
  const result = {};
  for (key in author) {
    if (Object.keys(result).length === 0) {
      result.likes = author[key];
      result.author = key;
    } else {
      if (result.likes < author[key]) {
        result.likes = author[key];
        result.author = key;
      }
    }
  }
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
