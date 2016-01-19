var taskData;

$(document).ready(function(){
    $("#taskForm").submit(function(event){
        event.preventDefault();
        var formData = $("#taskForm").serialize(); //"stringifying" the form data
        formData += "&complete=false"; //every new task starts out as incomplete
        $.ajax({
            type: "POST",
            data: formData,
            url: "/api/todos", //router: api.js
            success: function(data){
                taskData = data; //setting the global variable
                appendTasks(); //add to DOM
            }
        });
    });

    $("#someContainer").on('click', '.task p', function(){ //.task must be added when the task is appended to the DOM...
        var complete;
        complete = !$(this).parent().data("complete");
        var text = $(this).text().replace(" ", "+"); //removing the spaces, and sticking all the parts together, for use in the database
        var putData = "text=" + text + "&complete=" + complete; //finish building the data to insert

        $.ajax({
            type: "PUT",
            data: putData,
            url: "/api/todos/" + $(this).parent().data("id"),
            success: function(data){
                taskData = data;
                appendTasks(); //refresh the task display
            }
        });
    });

    $("#someContainer").on('click', '.delete', function(){ //each task has its own delete button - this gets called when pressed
        var id = $(this).parent().data("id");
        $.ajax({
            type: "DELETE",
            url: "/api/todos/" + id,
            success: function(data){
                taskData = data;
                appendTasks();
            }
        });
    });

    $(".get").on('click', function(){ //clears the DOM and rebuilds it with a fresh call to the database
                                      //(in case someone else adds/changes stuff)
        getData();
    });

});

function getData(){
    $.ajax({
        type: "GET",
        url: "/api/todos",
        success: function(data){
            taskData = data;
            appendTasks();
        }
    });
}

function appendTasks(){
    $("#someContainer").empty(); //clears out form so we build it "fresh"

    for(var i = 0 ; i < taskData.length ; i ++){
        $("#someContainer").append("<div class='task well col-md-3'></div>");
        var $el = $("#someContainer").children().last(); //our new task will be added to the end of the list
        $el.data("id", taskData[i].id); //gives the new element a data field matched to the SQL id
        $el.data("complete", taskData[i].complete);
        if(taskData[i].complete){
            $el.css("text-decoration", "line-through"); //cross off completed tasks
        }

        $el.append("<p class='lead'>" + taskData[i].text + "</p>"); //add the text and a "delete" button
        $el.append("<button class='btn btn-danger delete'>X</button>");
    }
}
