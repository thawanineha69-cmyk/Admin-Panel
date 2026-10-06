const generateUniqueSlug = async (Model, baseSlug) => {
  let slug = baseSlug;
  let count = 0;
  let maxAttempts = 100;

  // Loop to find unique slug
  while (await Model.findOne({ slug }) && count < maxAttempts) {
    count++;
    slug = `${baseSlug}-${count}`;
  }

  if (count >= maxAttempts) {
    throw new Error(`Unable to generate unique slug for ${baseSlug}`);
  }

  return slug;
};

module.exports = { generateUniqueSlug }