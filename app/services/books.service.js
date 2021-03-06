(function(){
  'use strict';

  angular.module('myBooksApp.services', [])
  .factory('booksService', booksService);

  function booksService($http, config){
    var service = {
      getBooks: getBooks,
      postBook: postBook,
      searchBookByIsbn: searchBookByIsbn,
      getBookById: getBookById,
      updateBook: updateBook,
      getBooksStatistics: getBooksStatistics
    };

    return service;

    function getBooks(){
      return $http({
        method: 'GET',
        url: '/books'
      }).then(getBooksCompleted)
        .catch(getBooksError);

      function getBooksCompleted(data, status, headers, config){
        return data.data;
      }

      function getBooksError(message){
        return message;
      }
    }

    function getBookById(id){
      return $http({
        method: 'GET',
        url: '/books/' + id
      }).then(getBookCompleted)
        .catch(getBookError);

      function getBookCompleted(data, status, headers, config){
        return data.data;
      }

      function getBookError(message){
        return message;
      }
    }

    function postBook(newBook){
      return $http({
        method: 'POST',
        url: '/books',
        data: newBook
      }).then(postBookCompleted)
        .catch(postBookError);

      function postBookCompleted(data){
        return data.status;
      }

      function postBookError(message){
        return message.status;
      }
    }

    function updateBook(book){
      return $http({
        method: 'PUT',
        url: '/books',
        data: book
      }).then(postBookCompleted)
        .catch(postBookError);

      function postBookCompleted(data){
        return data.status;
      }

      function postBookError(message){
        return message.status;
      }
    }

    function searchBookByIsbn(isbn){
      return $http({
        method: 'GET',
        url: config.googleApiUrl + isbn
      }).then(searchBookByIsbnCompleted)
        .catch(searchBookByIsbnError);

      function searchBookByIsbnCompleted(data){
        var book = {};
        if (data.data.totalItems >= 1){
          //book.thumbnail = data.data.items[0].volumeInfo.imageLinks.thumbnail;
          book.title = data.data.items[0].volumeInfo.title;
          book.description = data.data.items[0].volumeInfo.description;

          return book;
        }

        return null;
      }

      function searchBookByIsbnError(data){
        return data.status;
      }
    }

    function getBooksStatistics(year){
      return $http({
        method: 'GET',
        url: '/books?year=' + year
      }).then(getBooksStatisticsCompleted)
        .catch(getBooksStatisticsError);

      function getBooksStatisticsCompleted(data, status, headers, config){
        var result = [];
        for (var i = 1; i < 13; i++) {
          result.push(data.data.filter(getDataByMonth).length);
          //This is not good at all, I used lambda, but the uglify doesn't support ES6
          function getDataByMonth(data){
            return data.month == i;
          }
        }

        return [result];
      }

      function getBooksStatisticsError(message){
        return message;
      }
    }
  }
})();
