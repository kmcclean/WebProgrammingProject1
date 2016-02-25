//This takes creates a list of books that have been found and displays them for the viewer to see.
function add_books_to_list(response) {
    var returned_books_data = [];
    for (var i = 0; i < response.items.length; i++) {
        var book_to_add = make_list_of_book_data(response.items[i]);
        returned_books_data.push(book_to_add);
    }
    return returned_books_data;
}

function add_books_to_select_menu(books_list){
    $("book_results_select_box").val("");
    for (var i = 0; i < books_list.length; i++) {
        $("#book_results_select_box").append("<option>" + books_list[i]["book_title"] + "</option>");
        if (i == 0){
            fill_out_book_info_form(books_list[i]);
        }
    }
}

function fill_out_book_info_form(book){
    $("#book_title_input").val(book["book_title"]);
    $("#book_sub_title_input").val(book["sub_title"]);
    $("#book_author_input").val(book["author"]);
    $("#publisher_input").val(book["publisher"]);
    $("#published_date_input").val(book["published_date"]);
    $("#book_description_text_area").val(book["description"]);
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
    return one_book_data;
}

$("document").ready(function(response){
    var list_of_book_data = [];
    var current_book =
    $("#get_books_button").on("click", function(){
        var search_term = $("#search_bar").val();
        $.get("https://www.googleapis.com/books/v1/volumes?q=" + search_term, function(data) {
            list_of_book_data = add_books_to_list(data);
            add_books_to_select_menu(list_of_book_data);
        });
    });

    //http://stackoverflow.com/questions/5749597/jquery-select-option-click-handler
    //https://api.jquery.com/change/
    $("#book_results_select_box").change(function(){
        $("#book_results_select_box option:selected").each(function(){
            var book_title = $(this).text();

            for (var i = 0; i < list_of_book_data.length; i++){
                if (book_title == list_of_book_data[i]["book_title"]){
                    fill_out_book_info_form(list_of_book_data[i]);
                }
            }
        });
    });

    $("#put_searched_book_in_to_read_select_box").on("click", (function(){
        var to_read_title = $("#book_results_select_box option:selected").val();
        $("#books_to_read_select_box").append("<option>" + to_read_title + "</option>");
    }));

    $("#mark_as_being_read").on("click", (function(){
        var being_read_title = $("#books_to_read_select_box option:selected").val();
        $("#books_being_read_select_box").append("<option>" + being_read_title + "</option>");
    }));

    //$("#add_to_1_star_list").on("click", (function(){
    //    var one_star_title = $("#books_being_read_select_box option:selected").val();
    //    $("#one_star_title").append("<option>" + one_star_title + "</option>");
    //}));


    $("#add_to_1_star_list").click(function(){
        var one_star_title = $("#books_being_read_select_box option:selected").val();
        $("#one_star_title").append("<option>" + one_star_title + "</option>");
    });

    $("#add_to_2_star_list").on("click", (function(){
        var two_star_title = $("#books_being_read_select_box option:selected").val();
        $("#two_star_title").append("<option>" + two_star_title + "</option>");
    }));

    $("#add_to_3_star_list").on("click", (function(){
        var three_star_title = $("#books_being_read_select_box option:selected").val();
        $("#three_star_title").append("<option>" + three_star_title + "</option>");
    }));

    $("#add_to_4_star_list").on("click", (function(){
        var four_star_title = $("#books_being_read_select_box option:selected").val();
        $("#four_star_title").append("<option>" + four_star_title + "</option>");
    }));

    $("#add_to_5_star_list").on("click", (function(){
        var five_star_title = $("#books_being_read_select_box option:selected").val();
        $("#five_star_title").append("<option>" + five_star_title + "</option>");
    }));

});