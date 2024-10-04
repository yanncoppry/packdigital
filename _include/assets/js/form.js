



// CHECKBOX ICONED 

jQuery("input.iconed").parent("label").parent().addClass("iconify");
jQuery("input.number").parent("label").parent().addClass("numberify");


// CHECKMARK

jQuery("input[type=checkbox]:checked, input[type=radio]:checked")
  .parent("label").addClass("checked");


jQuery('input[type=checkbox]').change(function(){
    if(jQuery(this).is(":checked")) {
        jQuery(this).parent("label").addClass("checked");
        jQuery(this).parent().parent().parent().parent().addClass("hideme");
    } else {
        jQuery(this).parent("label").removeClass("checked");
    }
});

jQuery('input[type=radio]').change(function(){
    if(jQuery(this).is(":checked")) {

        jQuery(this).parent().parent().parent().find('label').removeClass("checked");
        jQuery(this).parent("label").addClass("checked");
        jQuery(this).parent().parent().parent().parent().parent().addClass("hideme");
    } else {
        jQuery(this).parent("label").removeClass("checked");
    }
});


// ZIP & CITY

jQuery('.rsform-block-code-postal').appendTo('.rsform-block-address');
jQuery('.rsform-block-ville').appendTo('.rsform-block-address');


// RANGE-SLIDER
jQuery('input[type="range"]')
  .parent("div")
  .addClass("range_slider");
jQuery('input[type="range"]').after("<output>50</output>");



jQuery('input[type="range"]').each((i, x) => jQuery(x).rangeslider({
    polyfill: false,
    onInit: function () {
        this.output = jQuery(jQuery("output")[i]).html(this.$element.val());
    },
    onSlide: function (
        position, value) {
        this.output.html(value);
    }
}));


function is_int(value) {
  if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
    return true;
  } else {
    return false;
  }
}




