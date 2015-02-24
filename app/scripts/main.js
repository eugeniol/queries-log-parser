$(document).on('click', '#process', function () {
  var logs = $('#logs').val().split('\n'),
    matchRe = /(\w+) :: (\{.+)$/,
    queries = [],
    allQueries = []

  logs.forEach(function (line) {
    var matches = line.match(matchRe)
    if (matches) {
      var query = JSON.parse(matches[2])
      queries.push(query)
      allQueries.push(query)
    }
  });

  console.info(queries.length, " queries found")

  //queries.forEach(function(q, ix){
  //  q._id = ix
  //})

  var sameQueries = []
  var lhs
  while (lhs = queries.shift()) {
    //console.log('main query', lhs)

    var sameQuery = {
      query: lhs,
      diffs: []
    };

    sameQueries.push(sameQuery);

    var i = queries.length;
    while (i--) {
      var rhs = queries[i]
      var differences = DeepDiff.diff(lhs, rhs);

      if (differences && differences.length == 1) {
        //console.log(differences)
        if (differences[0].path[0] == 'where') {
          var path = differences[0].path.join('.');

          if (!sameQuery[path])
            sameQuery[path] = [differences[0].lhs]

          //console.log("same query found", rhs)
          sameQuery[path].push(differences[0].rhs)
          sameQuery.diffs.push(differences);
          queries.splice(i, 1);
        }

      }
      else {
        console.log(differences)


      }

    }
  }

  sameQueries.forEach(function (q) {
    var tmpl = $(
      '<div class="col-xs-2>' +
      '  <div class="thumbnail">' +
      '   <div class="caption">' +
      '     <h3>Query</h3>' +
      '     <p></p>' +
      '     <p>' +
      '         <a href="#" class="btn btn-primary" role="button">Button</a> ' +
      '         <a href="#" class="btn btn-default" role="button">Button</a>' +
      '     </p>' +
      '   </div>' +
      '  </div>' +
      '</div>');


    tmpl.appendTo('#thumbs')

    console.log(q)
  })

  console.info(sameQueries.length, "queries reduced")


});

$('#process').click();
