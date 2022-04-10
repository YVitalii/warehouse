// $(function () {
//   var availableTags = [
//     "ActionScript",
//     "AppleScript",
//     "Asp",
//     "BASIC",
//     "C",
//     "C++",
//     "Clojure",
//     "COBOL",
//     "ColdFusion",
//     "Erlang",
//     "Fortran",
//     "Groovy",
//     "Haskell",
//     "Java",
//     "JavaScript",
//     "Lisp",
//     "Perl",
//     "PHP",
//     "Python",
//     "Ruby",
//     "Scala",
//     "Scheme",
//   ];

//   $("#searchField").autocomplete({
//     source: availableTags,
//   });

//   searchField.oninput = function (e) {
//     console.log(e.target.value);
//   };
//   searchField.oninput = function (e) {
//     console.log(e.target.value);
//   };
//   searchField.onchange = function (e) {
//     console.log(e.target.value);
//   };
// });
searchField.oninput = function (e) {
  console.log("onInput:", e.target.value);
};

$("#searchField").on("submit", function (e) {
  console.log("onEnter:", e.target.value);
  e.preventDefault();
});

// $("#searchField").keyup(function (e) {
//   if (e.keyCode == 13) {
//     console.log("onEnter:", e.target.value);
//     e.preventDefault();
//   }
// });

// searchField.onEnter = function (e) {
//   console.log("onEnter:", e.target.value);
// };
// let newItem = document.createElement("options");
// newItem.setAttribute("value", "Придумана інша опція");
// searchList.appendChild(newItem);

function findByName(name) {
  $.ajax({
    url: "/items/getByName",
    data: { name: name },
    success: function (items) {
      console.log("Received:", items.data);
      var newList = $('<datalist id="searchList"></datalist>');
      for (var i in items.data) {
        console.log("i=", i);
        newList.append("<option>" + items.data[i].name + "</option>");
      }
      console.group(newList);
      $("#searchList").replaceWith(newList);
    },
  });
}
