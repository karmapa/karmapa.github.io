var size = 120;

function tryIt() {
  console.log('tryIt');
};

function changeStyle1() {
  $("#wrapper").css({"background-color":"white","color":"black"});
  $("#content").css({"border":"1px solid black"});
  $("#content #right").css({"border-left":"1px solid black"});
};

function changeStyle2() {
  $("#wrapper").css({"background-color":"rgb(48, 51, 49)","color":"rgb(245, 241, 241)"});
  $("#content").css({"border":"1px solid rgb(245, 241, 241)"});
  $("#content #right").css({"border-left":"1px solid rgb(245, 241, 241)"});
};

function SizeToLarge() {

  if (size > 499) {
    alert("This is the largest !!");
  } else {
    size = size + 20;
    $("#content").css("font-size", size + "%");
  }

}


function SizeTosmall() {

  if (size > 99) {
    size = size - 20;
    $("#content").css("font-size", size + "%");
  } else {
    alert("This is the smallest !!");
  }

}

function tagSelect(num, event) {

  document.getElementById('alertArea').innerHTML = '';

  let tagNum = num.toString();

  $('span').removeClass("highlight");
  $('[class="' + tagNum + '"]').addClass('highlight');

  var thisParDiv = event.target.parentNode.id;
  let otherDiv = '';
  thisParDiv === 'left'? otherDiv = 'right':otherDiv = 'left' ;

  const el = document.getElementById(otherDiv);
  const elmt = el.getElementsByClassName('highlight')[0];
  'undefined' !== typeof elmt? elmt.scrollIntoView({block: "center"}):document.getElementById('alertArea').innerHTML = '　　無同步詞彙　　';
};

function readTextLeft(fileName) {
  $(function() {
    $.ajax({
      url: fileName,
      dataType: 'text',
      success: function(data) {
        document.getElementById("left").innerHTML = data;
      }
    });
  });
};

function readTextRight(fileName) {
  $(function() {
    $.ajax({
      url: fileName,
      dataType: 'text',
      success: function(data) {
        document.getElementById("right").innerHTML = data;
      }
    });
  });
};
