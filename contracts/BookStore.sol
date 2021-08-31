// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.8.0;

contract BookStore {
    
    enum BookState { Available, NotAvailable }

    
    uint constant private BOOK_COUNT = 50;
    
    address[BOOK_COUNT] booksKeeper;
    BookState[BOOK_COUNT] booksState;
    
    address payable owner;
    
    constructor(address payable _owner) public {
        owner = _owner;
    }
    
    function borrow(uint _index) public payable {
        require(_index >=0 && _index < BOOK_COUNT);
        require(booksState[_index] == BookState.Available);
        
        booksKeeper[_index] = msg.sender;
        booksState[_index] = BookState.NotAvailable;
        
        owner.transfer(msg.value);
    }
    
    function release(uint _index) public {
        require(_index >=0 && _index < BOOK_COUNT);
        require(booksKeeper[_index] == msg.sender);
        
        booksKeeper[_index] = owner;
        booksState[_index] = BookState.Available;
    }


    function getBooksKeeper() public view returns (address[BOOK_COUNT] memory) {
        return booksKeeper;
    }

    function getBooksState() public view returns (BookState[BOOK_COUNT] memory) {
        return booksState;
    }

    function getBooks() public view returns (address[BOOK_COUNT] memory, BookState[BOOK_COUNT] memory) {
        return (booksKeeper, booksState);
    }

    
}