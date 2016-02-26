//This takes creates a list of books that have been found and displays them for the viewer to see.
function add_books_to_list(response) {
    var returned_books_data = [];
    for (var i = 0; i < response.items.length; i++) {
        var book_to_add = make_list_of_book_data(response.items[i]);
        returned_books_data.push(book_to_add);
    }
    return returned_books_data;
}

//This takes books from the search results and adds them to the search results menu.
function add_books_to_search_results_menu(books_list){
    $("book_results_select_box").val("");
    for (var i = 0; i < books_list.length; i++) {
        $("#book_results_select_box").append("<option>" + books_list[i]["book_title"] + "</option>");
        if (i == 0){
            fill_out_book_info_form(books_list[i]);
        }
    }
}

function fill_out_book_info_form(book){
    $('#book_title_input').val(book["book_title"]);
    $('#book_sub_title_input').val(book["sub_title"]);
    $('#book_author_input').val(book["author"]);
    $('#publisher_input').val(book["publisher"]);
    $('#published_date_input').val(book["published_date"]);
    $('#book_description_text_area').val(book["description"]);
}

//http://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript
function make_list_of_book_data(item){
    var one_book_data = {};
    one_book_data["book_title"] = item.volumeInfo.title;
    one_book_data["sub_title"]= item.volumeInfo.subtitle;
    one_book_data["author"]= item.volumeInfo.authors;
    one_book_data["publisher"]= item.volumeInfo.publisher;
    one_book_data["published_date"] = item.volumeInfo.publishedDate;
    one_book_data["description"] = item.volumeInfo.description;
    one_book_data["book_link"] = item.volumeInfo.canonicalVolumeLink;
    return one_book_data;
}

//This function takes books and moves them between lists, in order to properly reference them whenever one of the searches
//needs more details.
function move_books_between_lists(old_list, new_list, book_title){
    for (var i = 0; i < old_list.length; i++){
        if (old_list[i]["book_title"] == book_title){
            new_list.push(old_list[i]);

            //Apparently this is the best way to remove something from a list in Javascript.
            //http://stackoverflow.com/questions/5767325/remove-a-particular-element-from-an-array-in-javascript
            old_list.splice(i, 1);
            break;
        }
    }
}

function add_selected_book(old_box, new_box){
    var title = $(old_box + " option:selected").val();
    $(new_box).append("<option>" + title + "</option>");
    return title;
}

//When a books is moved from a select box, this function is called to remove it.
function remove_selected_book(box){
    //http://stackoverflow.com/questions/1518216/jquery-remove-options-from-select
    //https://api.jquery.com/remove/
    $(box + " option:selected").remove();
}

$("document").ready(function(response){
    var list_of_books_from_search = [];
    var list_of_books_to_read = [];
    var list_of_books_being_read = [];
    var list_of_1_star_books = [];
    var list_of_2_star_books = [];
    var list_of_3_star_books = [];
    var list_of_4_star_books = [];
    var list_of_5_star_books = [];

    //When the referred to button is pressed, a query is sent to the Google Books API which allows the user to find the
    //results from their search.
    $("#get_books_button").on("click", function(){
        var search_term = $("#search_bar").val();
        $.get("https://www.googleapis.com/books/v1/volumes?q=" + search_term, function(data) {
            list_of_books_from_search = [];
            //This clears out the search list whenever a new search is run.
            //http://stackoverflow.com/questions/47824/how-do-you-remove-all-the-options-of-a-select-box-and-then-add-one-option-and-se
            //https://api.jquery.com/empty/
            $("#book_results_select_box").empty();
            list_of_books_from_search = add_books_to_list(data);
            add_books_to_search_results_menu(list_of_books_from_search);
        });
    });

    //http://stackoverflow.com/questions/5749597/jquery-select-option-click-handler
    //https://api.jquery.com/change/
    $("#book_results_select_box").change(function(){
        $("#book_results_select_box option:selected").each(function(){
            var book_title = $(this).val();
            for (var i = 0; i < list_of_books_from_search.length; i++){
                if (book_title == list_of_books_from_search[i]["book_title"]){
                    fill_out_book_info_form(list_of_books_from_search[i]);
                }
            }
        });
    });

    //When this is pressed, it opens up a link to Google Books for the book chosen in the select box.
    //http://stackoverflow.com/questions/2906582/how-to-create-an-html-button-that-acts-like-a-link
    $("#go_to_button").on("click", (function(){
        var book_to_open = $("#books_being_read_select_box option:selected").val();
        for(var i = 0; i < list_of_books_being_read.length; i++){
            if (book_to_open == list_of_books_being_read[i]["book_title"]){
                location.href=list_of_books_being_read[i]["book_link"];
                break;
            }
        }
    }));

    //This takes a book out of the set of searched books and puts it into the set of books to read.
    $("#put_searched_book_in_to_read_select_box").on("click", (function(){
        var book = add_selected_book("#book_results_select_box", "#books_to_read_select_box");

        move_books_between_lists(list_of_books_from_search, list_of_books_to_read, book);
        remove_selected_book("#book_results_select_box");
        //http://stackoverflow.com/questions/1394550/how-to-select-the-first-element-in-the-dropdown-using-jquery
        $('#book_results_select_box option:first-child').attr("selected", "selected");
        var first = $("#book_results_select_box option:first-child").val();
        for (var i = 0; i < list_of_books_from_search.length; i++){

            if (list_of_books_from_search[i]["book_title"] == first){
                fill_out_book_info_form(list_of_books_from_search[i]);
                break;
            }
        }
    }));

    //This takes a book out of the set of intended to read, and marks it as being read.
    $("#mark_as_being_read").on("click", (function(){
        var book = add_selected_book("#books_to_read_select_box", "#books_being_read_select_box");
        move_books_between_lists(list_of_books_to_read, list_of_books_being_read, book);
        remove_selected_book("#books_to_read_select_box");
    }));

    //This takes a book that the user has read, and puts it into their one star review category.
    $("#add_to_1_star_list").on("click", (function(){
        var book = add_selected_book("#books_being_read_select_box", "#1_star_select_box");
        move_books_between_lists(list_of_books_being_read, list_of_1_star_books, book);
        remove_selected_book("#books_being_read_select_box");
    }));

    //This takes a book that the user has read, and puts it into their two star review category.
    $("#add_to_2_star_list").on("click", (function(){
        var book = add_selected_book("#books_being_read_select_box", "#2_star_select_box");
        move_books_between_lists(list_of_books_being_read, list_of_2_star_books, book);
        remove_selected_book("#books_being_read_select_box");
    }));

    //This takes a book that the user has read, and puts it into their three star review category.
    $("#add_to_3_star_list").on("click", (function(){
        var book = add_selected_book("#books_being_read_select_box", "#3_star_select_box");
        move_books_between_lists(list_of_books_being_read, list_of_3_star_books, book);
        remove_selected_book("#books_being_read_select_box");
    }));

    //This takes a book that the user has read, and puts it into their four star review category.
    $("#add_to_4_star_list").on("click", (function(){
        var book = add_selected_book("#books_being_read_select_box", "#4_star_select_box");
        move_books_between_lists(list_of_books_being_read, list_of_4_star_books, book);
        remove_selected_book("#books_being_read_select_box");
    }));

    //This takes a book that the user has read, and puts it into their five star review category.
    $("#add_to_5_star_list").on("click", (function(){
        var book = add_selected_book("#books_being_read_select_box", "#5_star_select_box");
        move_books_between_lists(list_of_books_being_read, list_of_5_star_books, book);
        remove_selected_book("#books_being_read_select_box");
    }));
});