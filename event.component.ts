import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { EventService} from './event.service';
import { AuthService} from './../common/services/auth.service';
import { Router } from '@angular/router';
import { Options, ChangeContext, PointerType } from 'ng5-slider';


declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-datacrowd',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})


export class EventComponent implements OnInit {

    minValue: number = 1;
    maxValue: number = 5;
    options: Options = {
      floor: 1,
      ceil: 5
      //step: 5
    };
    value: number = 3;

    logText: string = '';

    // on slider click
    onUserChangeStart(changeContext: ChangeContext): void {
        console.log("In User Change Start");
        $(".btn_enter_2").hide();
        $(".btn_enter_2").attr("disabled", "disabled");
    }
    
    onUserChangeEnd(changeContext: ChangeContext): void {
        console.log("In User Change End");
        
        var old_value = $("#star_rating").val();
        console.log(old_value+ ' - '+changeContext.value)
        if(changeContext.value == old_value){
            $('.ng5-slider > span').removeClass('ng5-slider-active');
        }
        
        $("#star_rating").val(changeContext.value);
      
        var star = changeContext.value;
        if(star > 0 && star < 3){
          $("#saveDoyouAgreeHidden").val("No");
        } else if(star > 3 && star <= 5){
          $("#saveDoyouAgreeHidden").val("Yes");
        } else {
          $("#saveDoyouAgreeHidden").val("NA");
        }
    }
  
    onValueChange(changeContext: ChangeContext): void {
        console.log("In Value Change");
        
        $(".btn_enter_2").show();
        $(".btn_enter_2 i").css("color","#fff");
        $(".btn_enter_2").removeAttr("disabled", true);
    }
    
    public event_list = [];
    eventCodeForm: FormGroup;
    submitted = false;
    success = false;
    success_msg = '';
    ipAddress: any;
    public event_details = [];
    error: boolean = false;
    error_msg = '';
    eventTaskForm : FormGroup;
    required_in_singular = "0";
    
  
    constructor(private formBuilder: FormBuilder, private _EventService: EventService, private http: HttpClient, private _AuthService: AuthService, private router: Router) {

        this.eventCodeForm = this.formBuilder.group({
          event_code: ['',Validators.required]
        })

        //this is to get ip address
        this.http.get('https://jsonip.com').subscribe((ipOfNetwork) => this.ipAddress =  ipOfNetwork['ip']);
    }

    // ratingChange(value){  

    //   if($("#star_rating").val() == value){
    //     $(".btn_enter_2").hide();
    //     $(".btn_enter_2").attr("disabled", "disabled");
    //     $(".ng5-slider-span").removeClass("ng5-slider-active");
    //   } 
    //   else {

    //       $("#star_rating").val(value);

    //       var star = value;
          
    //       if(star > 0 ){
    //         $(".btn_enter_2").show();
    //         $(".btn_enter_2 i").css("color","#fff");
    //         $(".btn_enter_2").removeAttr("disabled", true);
    //       } else {
    //         $(".btn_enter_2").hide();
    //         $(".btn_enter_2").attr("disabled", "disabled");
    //       }

    //       if(star > 0 && star < 3){
    //         $("#saveDoyouAgreeHidden").val("No");
    //       } else if(star > 3 && star <= 5){
    //         $("#saveDoyouAgreeHidden").val("Yes");
    //       } else {
    //         $("#saveDoyouAgreeHidden").val("NA");
    //       }
    //       $("#star_rating").val(value);
    //   }
    // }

    initialize_slider(){
      this.options = {
        floor: 1,
        ceil: 5,
        step: 1
      };
      this.value = 3;
      // $("#star_rating").val(3);
    }

    ngOnInit() {
      
        //$("#slider").html('<div><rzslider rz-slider-model="slider.value" rz-slider-options="slider.options"></rzslider></div>');
        // $("#slider_yes_no").html('<div ng-controller="myCtrl1"><rzslider rz-slider-model="slider.value" rz-slider-options="slider.options"></rzslider></div>');
      
    }

    getEventList(){
      this._EventService.getEventList().subscribe(
        data => {
          this.event_list = data
        },
        error => {
          this.error = true;
          this.error_msg = error;
        }
      );
    }
    
    
    //THis is for submit Event code form
    onSubmitEventCodeForm(){
      this.submitted = true;
      this.error = false;

      if(this.eventCodeForm.invalid){
        return 
      }
      
      var param = JSON.stringify({event_code:this.eventCodeForm.controls.event_code.value});
      this._EventService.findEventCode(param).subscribe(
        data => {
          this.success = true;
          this.success_msg = "Login successfully";
          this.event_details.push(data);
          this.setRequiredInSingular(data);
          this._AuthService.setLoggedIn(true);
          this._AuthService.setUserSession(data);

          $("#submitEventCodeSection").hide();
          $("#logginToolSection").show();

          this.initialize_slider();
          
          //window.location.href = '/dashboard';
          //this.router.navigate(['/dashboard']);
          /*if(!data.user_id){
            this._AuthService.setUserId(data.user_id);
          }*/
          
        },
        error => {
          this.error = true;
          this.error_msg = error;
        }
      );


      //this.success = true;
      /*alert(AppConstants.ENDPOINTAPI_URL);
      this.http.post(AppConstants.ENDPOINTAPI_URL+'/api/event').map((res:Response) => res.json());*/
    }

    btnEnable(id){
      $(".btn_enter_"+id).show();
      $(".btn_enter_"+id).removeAttr("disabled", true);
    } 

    btnDisabled(id){
      $(".btn_enter_"+id).hide();
      $(".btn_enter_"+id).attr("disabled", "disabled");
    }

    //THis is for Quick Take
    saveQuickTake(id){
      var saveQuickTakeHidden = $('#saveQuickTakeHidden').val();
      if(saveQuickTakeHidden == id && saveQuickTakeHidden != ''){
        var stars = $('.social_list').children('li');
        for (var i = 0; i < stars.length; i++) {
          $(stars[i]).children('span').removeClass('selected');
        }
         $(".btn_enter_1").hide();
       $(".btn_enter_1").attr("disabled", true);
        $('#saveQuickTakeHidden').val('');
      }else{

      
          $('#saveQuickTakeHidden').val(id);
          var stars = $('.social_list').children('li');
          for (var i = 0; i < stars.length; i++) {
            $(stars[i]).children('span').removeClass('selected');
          }
            $(stars[id-1]).children('span').addClass('selected');
            // $(".btn_enter_1").removeAttr("disabled", true);
            $('#saveQuickTakeAtag').children('i').addClass('send_success');
            // this.ShowTooltip(1);
           this.btnEnable(1);
    }
    }

    onsaveQuickTake(){
      this.loaderShow(1);
      var quick_take_value = $('#saveQuickTakeHidden').val();

      if ( quick_take_value == '' ){
        this.loaderHide(1);
        alert('Please select any one.');
        return false;
      }

      //This is to check if option is enable or not
      var param1 = JSON.stringify({event_code : this._AuthService.getUserSession().event_code}); 
      console.log(param1);
      this._EventService.getRequiredInSingularEnabled(param1).subscribe(
        data => {
          this.setRequiredInSingular(data);
        },
        error => {
          // some reason displaying in here
          var msg = "Unable to call Singular";
          //this.ShowSendMsg(1,msg);
        }
      );
      
      // check what action we are using

      if(this.required_in_singular == "1") {
        var composition_name = "";
        if (quick_take_value == "3") {
          composition_name = "Confused";
        } else if (quick_take_value == "5") {
          composition_name = "Heart";
        } else if (quick_take_value == "1") {
          composition_name = "ClipIt";
        } else if (quick_take_value == "2") {
          composition_name = "Bored";
        } else if (quick_take_value == "4") {
          composition_name = "Happy";
        }
        if (composition_name != "") {
          var param2 = JSON.stringify(
            [
              {"compositionName": composition_name, "animation": {"action": "jump", "to": "Out1" }},
              { "compositionName": composition_name, "animation": { "action": "play", "from": "Out1", "to":"In"}}
            ]);
          this._EventService.addQuickTakeToSingular(param2).subscribe(
            error => {
              // this.HideTooltip(1);
              this.loaderHide(1);
              //var msg = "Unable to Connect to singular.";
              //this.ShowSendMsg(1,msg);
            }
          );
        }
      }
     
      var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_code : this._AuthService.getUserSession().event_code ,quick_take:quick_take_value}); 
      this._EventService.addQuickTake(param).subscribe(
        data => {
          this.success = true;
          this.success_msg = "Record Inserted successfully";
          // $.notify("Data Sent successfully!", "success");

          $('#saveQuickTakeHidden').val('');
          $('.social_list').children('li').children('span').removeClass('selected');
          $('#saveQuickTakeAtag').children('i').removeClass('send_success');
          // this.DivFadeInOut(1);
          // this.HideTooltip(1);
          this.loaderHide(1);
          this.loaderHide(1);
          this.btnDisabled(1)
          

          var msg = "Feedback sent successfully!";
          this.ShowSendMsg(1,msg);
        },
        error => {
          // this.HideTooltip(1);
          this.loaderHide(1);
          var msg = "Quick Take Submission Error";
          this.ShowSendMsg(1,msg);
        }
      );
   
    }

    onsaveDoyouAgree(){
      this.loaderShow(2);
      var star_rat = $('#star_rating').val();
      if ( star_rat == '' ){
        this.loaderHide(2);
        alert('please rate first');
        return false;
      }

      var DoYouAgree = $('#saveDoyouAgreeHidden').val();
      
      var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_code : this._AuthService.getUserSession().event_code ,rating:star_rat , do_you_agree : DoYouAgree }); 

      this._EventService.addDoYouAgree(param).subscribe(
        data => {
          this.success = true;
          this.success_msg = "Record Inserted successfully";
          // $.notify("Data Sent successfully!", "success");
         // $('#rating-stars').children('span.star').removeClass('selected');
          $('#star_rating').val('');
          $('#saveDoyouAgreeHidden').val('');
          $('#saveDoyouAgreeaTag').children('i').removeClass('send_success');
          $('#rating-stars').children('span.star').removeClass('selected')
          // this.DivFadeInOut(2);
          // this.HideTooltip(2);
          this.loaderHide(2);
          this.btnDisabled(2);
          var msg = "Feedback sent successfully!";
          this.ShowSendMsg(2,msg);
          /*$("#do_you_agree").hide();
          $("#agree_msg").html("Data Sent successfully!");
          var show_div = $(".div_show:visible").length;
          if(show_div == 0){
            $(".signupbtn").removeAttr('disabled'); 
          }*/
        },
        error => {
          // this.HideTooltip(2);
          this.loaderHide(2);
          var msg = "Do You Agree Submission Error";
          this.ShowSendMsg(2,msg);
          /*this.error = true;
          this.error_msg = error;*/
          // $.notify(error, "error");
        }
      );

    }


    check_submit() {
      
      var needtosaid = $('#needtosaid').val();
      if ((needtosaid.trim()).length > 0) {
        $('#saveWhatNeedtosaiddataAtage').children('i').addClass('send_success');
        // this.ShowTooltip(3);
        this.btnEnable(3);
      } else {
          $('#saveWhatNeedtosaiddataAtage').children('i').removeClass('send_success');
          // this.HideTooltip(3);
          this.btnDisabled(3);

      }
    }

    saveWhatNeedtosaiddata(){
      this.loaderShow(3);
      var needtosaid = $('#needtosaid').val();
      if(needtosaid == ''){
        this.loaderHide(3);
        alert('Please Enter Text');
        return;
      }
      //var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_id : this._AuthService.getUserSession().event_id ,what_needs_to_be_said:needtosaid }); 
      var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_code : this._AuthService.getUserSession().event_code ,what_needs_to_be_said:needtosaid }); 

      this._EventService.addSaidNote(param).subscribe(
        data => {
          this.success = true;
          this.success_msg = "Record Inserted successfully";
          // $.notify("Data Sent successfully!", "success");
          $("#needtosaid").val('');
          $('#saveWhatNeedtosaiddataAtage').children('i').removeClass('send_success');
          // this.DivFadeInOut(3);
          // this.HideTooltip(3);
          this.loaderHide(3);
          this.btnDisabled(3);
          var msg = "Feedback sent successfully!";
          this.ShowSendMsg(3,msg);
          /*$("#need_to_say").hide();
          $("#need_to_say_msg").html("Data Sent successfully!");
          var show_div = $(".div_show:visible").length;
          if(show_div == 0){
            $(".signupbtn").removeAttr('disabled'); 
          }*/
        },
        error => {
          // this.HideTooltip(3);
          this.loaderHide(3);
          var msg = "Unable to submit note";
          this.ShowSendMsg(3,msg);
          /*this.error = true;
          this.error_msg = error;*/
          // $.notify(error, "error");
        }
      );
   

    }


    selectQueAns(){
      var selected_value = $("#que_ans").val();
      if(selected_value != ""){
        $('#saveQueAns').children('i').addClass('send_success');
        // this.ShowTooltip(4);
        this.btnEnable(4);
      } else {
        $('#saveQueAns').children('i').removeClass('send_success');
        // this.HideTooltip(4);
        this.btnDisabled(4);
      }

    }

    //THis is for Quick Take
    saveQueAns(){
      this.loaderShow(4);
      var selected_value = $("#que_ans").val();

      if ( selected_value == '' ){
        this.loaderHide(4);
        alert('Please select option.');
        return false;
      }

      $('#saveQueAnsHidden').val(selected_value);
      
      var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_code : this._AuthService.getUserSession().event_code ,questions_confusions:selected_value}); 
      //var param = JSON.stringify({user_id:this._AuthService.getUserSession().user_id, event_id : this._AuthService.getUserSession().event_id ,questions_confusions:selected_value}); 
      
      this._EventService.addQuestionAndConfusion(param).subscribe(
        data => {
          // $.notify("Data Sent successfully!", "success");
          
          $("#que_ans").val('');
          
          $('#saveQueAns').children('i').removeClass('send_success');
          // this.DivFadeInOut(4);
          // this.HideTooltip(4);
          this.loaderHide(4);
          this.btnDisabled(4);
          var msg = "Feedback sent successfully!";
          this.ShowSendMsg(4,msg);

          /*$("#que_confusion").hide();
          $("#que_ans_msg").html("Data Sent successfully!");
          var show_div = $(".div_show:visible").length;
          if(show_div == 0){
            $(".signupbtn").removeAttr('disabled'); 
          }*/
        },
        error => {
          // this.HideTooltip(4);
          this.loaderHide(4);
          var msg = "Unable to submit question and answer";
          this.ShowSendMsg(4,msg);
          // $.notify(error, "error");
          /*this.error = true;
          this.error_msg = error;*/
        }
      );
    }
    
    DivFadeInOut(id){

      $(".div_show_"+id).fadeOut();
      $(".div_hide_"+id).fadeIn();
      $(".div_hide_"+id).html("Record Inserted.");
      
      setTimeout(function(){ 
        $(".div_hide_"+id).delay(1000).fadeOut();
        $(".div_show_"+id).delay(1000).fadeIn();
      }, 2000);

    }

    loaderShow(id){
      $(".div_loader_"+id).show();
      $(".loader_"+id).show();
      // $(".div_loader_"+id).css("opacity","0.7")
      

      // $(".div_show_"+id).css("opacity","0.2")
      // $(".div_sent_msg_"+id).fadeIn();

    }

    loaderHide(id){
      // $(".loader_"+id).hide();
      $(".div_loader_"+id).hide();
      $(".loader_"+id).hide();
      // $(".div_show_"+id).css("opacity","1")
    }

    setRequiredInSingular(data){
      this.required_in_singular = data.required_in_singular;
    }


    ShowSendMsg(id,msg){
        $(".div_show_"+id).css("opacity","0.2")
        $(".div_sent_msg_p_"+id).html(msg);
        $(".div_sent_msg_"+id).fadeIn();
        
        
        setTimeout(function(){ 
          $(".div_show_"+id).css("opacity","1")
          $(".div_sent_msg_"+id).fadeOut();
          $(".div_sent_msg_p_"+id).html('');
        }, 1000);
    }

    openLearnMorePopup(){
      $("#learnMoreModal").modal("show");
    }

}
