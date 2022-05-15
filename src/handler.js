const {
    nanoid
} = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    } else {
        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
        };
        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            const response = h.response({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        } else {
            const response = h.response({
                status: "error",
                message: "Buku gagal ditambahkan",
            });
            response.code(500);
            return response;
        }
    }
};


const getAllBooksHandler = (request, h) => {
    const response = h.response({
        status: "success",
        data: {
            books: books.map((book) => {
                const data = {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                };
                return data;
            }),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;
    const book = books.find((book) => book.id === bookId);

    if (book === undefined) {
        const response = h.response({
            status: "fail",
            message: "Buku tidak ditemukan",
        });
        response.code(404);
        return response;
    } else {
        const response = h.response({
            status: "success",
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }
};

const editBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const book = books.findIndex((book) => book.id === bookId);
    if (book === -1) {
        const resnponse = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        });
        resnponse.code(404);
        return resnponse;
    } else if (name === undefined) {
        const resnponse = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        resnponse.code(400);
        return resnponse;
    } else if (readPage > pageCount) {
        const resnponse = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        resnponse.code(400);
        return resnponse;
    } else {
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage ? true : false;
        books[book] = {
            ...books[book],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;
    const book = books.findIndex((book) => book.id === bookId);
    if (book === -1) {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }
    books.splice(book, 1);
    const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};