$(document).ready(function(){
    $('#site').change(function(){     
        var selected = $('option:selected',this).val();
        
        if(selected == 'losangeles'){
            $('#SD').hide();
            $('SF').hide();
            $('#LA').show();
        }
        
        if(selected == 'sandiego'){
            $('#LA').hide();
            $('#LA').hide();
            $('#SD').show();
        }
        
        if(selected == 'sfbay'){
            $('#LA').hide();
            $('#SD').hide();
            $('#SF').show();
        }
    });
});
