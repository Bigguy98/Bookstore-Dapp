App = {
  web3Provider: null,
  contracts: {},
  account: null,

  init: async function() {
    // Load pets.
    $.getJSON('../books.json', function(data) {
      var booksRow = $('#booksRow');
      var bookTemplate = $('#bookTemplate');
      console.log("book numbers : ", data.length)
      for (i = 0; i < data.length; i ++) {
        bookTemplate.find('.panel-title').text(data[i].name);
        bookTemplate.find('img').attr('src', data[i].img);
        // petTemplate.find('.pet-breed').text(data[i].breed);
        // petTemplate.find('.pet-age').text(data[i].age);
        // petTemplate.find('.pet-location').text(data[i].location);
        bookTemplate.find('.btn-issue').attr('data-id', data[i].id);
        bookTemplate.find('.btn-return').attr('data-id', data[i].id);

        booksRow.append(bookTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    // check nếu browsers đnag sử dụng có hỗ trợ dapp, kết nối với blockchain network thì lấy luôn làm webProvider
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    // đợi load xong account thì mới tạo contract
    web3.eth.getAccounts((err, accounts) => {
      App.account = accounts[0];
      console.log(App.account);
      return App.initContract();
    })
    
  },

  initContract: function() {

    $.getJSON('BookStore.json', function(data) {
      App.contracts.BookStore = TruffleContract(data);

      App.contracts.BookStore.setProvider(App.web3Provider);

      return App.setBookStatus();
    })    

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-issue', App.handleIssue);
    $(document).on('click', '.btn-return', App.handleReturn);
  },

  setBookStatus: function() {
    var bookStoreInstance;
    App.contracts.BookStore.deployed().then((instance) => {
      bookStoreInstance = instance;
      return bookStoreInstance.getBooks();
    }).then((result) => {

      booksKeeper = result[0];
      booksState = result[1].map((e) => {
        var temp = e.c;
        return temp[0]
      });

      console.log("book keepers: ", booksKeeper);
      console.log("book states: ", booksState);

      for(i=1;i<booksState.length;i++) {
        var text = booksState[i] === 0 ?  'Yes' : 'No';
        $('.panel-book').eq(i-1).find('span').text(text);
        $('.panel-book').eq(i-1).find('.btn-issue').prop('disabled', booksState[i] === 1);
        $('.panel-book').eq(i-1).find('.btn-return').prop('disabled', booksKeeper[i] !== App.account);
      }
    }).catch((err) => {
      if(err) {
          console.log(err.message);
        }
    })

  },

  handleIssue: function(event) {
    event.preventDefault();

    var bookId = parseInt($(event.target).data('id'));
    console.log("issue bookId ", bookId);

    var bookStoreInstance;
    App.contracts.BookStore.deployed().then((instance) => {
        bookStoreInstance = instance;
        // lấy danh sách tài khoản
        // đăng nhập localhost:7545 trên metamask tự động lấy account đầu tiền
        return bookStoreInstance.borrow(bookId, {from: App.account});
      }).then( () => {
        return App.setBookStatus();
      }).then ( (err) => {
        if(err) {
          console.log(err.message);
        }
      });

  },

  handleReturn: function(event) {
    event.preventDefault();

    var bookId = parseInt($(event.target).data('id'));
    console.log("return bookId  ", bookId);

    var bookStoreInstance;
    App.contracts.BookStore.deployed().then((instance) => {
        bookStoreInstance = instance;
        // lấy danh sách tài khoản
        // đăng nhập localhost:7545 trên metamask tự động lấy account đầu tiền
        return bookStoreInstance.release(bookId, {from: App.account});
      }).then( () => {
        return App.setBookStatus();
      }).then ( (err) => {
        if(err) {
          console.log(err.message);
        }
      });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
