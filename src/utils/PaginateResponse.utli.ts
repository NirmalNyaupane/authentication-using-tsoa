const paginateResponse = (count: number, page?: number, limit?: number) => {
    const lastPage: number = page ? Math.ceil(page / (limit ?? 1)) : 1
    const prevPage = page && page - 1 > 0 ? page - 1 : null;
    const nextPage = page && page + 1 < lastPage ? page + 1 : null;
    const currentPage = page ?? 1;
    const totalCount = count;

    return { prevPage, nextPage, currentPage,lastPage, totalCount }
}

export {paginateResponse}