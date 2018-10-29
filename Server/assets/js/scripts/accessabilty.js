$(function(){
  const addStudentBtn = $("#addStudentBtn");
  const addStudentInput = $("#studentName_auto");

  const addGroupBtn = $('#addGroup_btn');
  const addGroupInput = $('#group_name');

  const addExamBtn = $('#addExam_btn');
  const addExamInput = $('#addExam_input');

    function focus(btn , input ){
   	btn.click(function(){
    setTimeout(function(){ 
   	 input.focus();
   	 console.log("done");
    }, 500);
   });
   }
   focus( addStudentBtn , addStudentInput );
   focus( addGroupBtn , addGroupInput);
   focus( addExamBtn , addExamInput);

});

