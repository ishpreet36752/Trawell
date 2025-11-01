
async function paginate(model, query = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = "",
    select = ""
  } = options;

  const skip = (page - 1) * limit;

  // Fetch paginated results
  const [results, total] = await Promise.all([
    model
      .find(query)
      .populate(populate)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    currentPage: page,
    totalPages,
    totalDocuments: total,
    results,
  };
}

module.exports = {paginate}
