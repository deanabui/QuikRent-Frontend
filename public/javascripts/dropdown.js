$(document).ready(function(){
    $('#site').change(function(){
        $('#LA').hide();
        $('#SD').hide();
        $('SF').hide();
        
        var selected = $('option:selected',this).val();
        
        if(selected == 'losangeles'){
            $('#SD').hide();
            $('SF').hide();
            $('#LA').show();
        }
        
        if(selected == 'sandiego'){
            $('#LA').hide();
            $('#SF').hide();
            $('#SD').show();
        }
        
        if(selected == 'sfbay'){
            $('#LA').hide();
            $('#SD').hide()
            $('#SF').show();
        }
    });
});
