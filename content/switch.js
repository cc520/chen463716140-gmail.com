function showSwitch(){
    var v_split = document.getElementById('v_split'),
        v_split_right = document.getElementById('v_split_right'),
        state = v_split.getAttribute('state'),
        hidden_state = 'true';
        if(state === 'open'){
            state = 'collapsed';
            hidden_state = 'true';
        }else{
            state = 'open';
            hidden_state = 'false';
        }
    v_split_right.setAttribute('hidden',hidden_state);
    v_split.setAttribute('state',state);
    return false;
} 
