//-----------------------------------------------------------------------------
// nyacom (C) 2018.12
// Note: JQuery is required
//-----------------------------------------------------------------------------
var $jq = $.noConflict(true);
$jq(function($){
	//var boards = ['fic08', 'fic07', 'fic06', 'fic05'];
	//var boards = ['fic08', 'fic07', 'fic06', 'fic05', 'fic01', 'fic02', 'fic03', 'fic04'];
	var boards = ['fic08', 'fic07', 'fic06', 'fic05', 'fic01', 'fic02', 'fic03', 'fic04', 'm2fic12', 'm2fic13'];
	var MAX_PORTS = 4;
	var MAX_CHANNELS = 16;

	//-------------------------------------------------------------------------
	// on document ready
	//-------------------------------------------------------------------------
	$(document).ready(function(){
		get_status();
	});

	//-------------------------------------------------------------------------
	// get status from boards
	//-------------------------------------------------------------------------
	function get_status(){
		boards.forEach(function(board){
			get_board_status(board);
		});
	}

	function auto_get_status() {
		boards.forEach(function(board){
			id = '#' + board + '-chkbox_allow_reflesh';
			if ($(id).prop('checked', true)) {
				get_board_status(board);
			}
		});
	}

	//-------------------------------------------------------------------------
	// Set status to dom
	//-------------------------------------------------------------------------
	function set_status(board, status) {
		var id = '';

		// allow reflesh checkbox
		id = '#' + board + '-chkbox_allow_reflesh';
		if (status['config']['auto_reflesh']) {
			$(id).prop('checked', true);
		} else {
			$(id).prop('checked', false);
		}

		// allow GPIO checkbox
		id = '#' + board + '-chkbox_allow_gpio';
		if (status['config']['use_gpio']) {
			$(id).prop('checked', true);
		} else {
			$(id).prop('checked', false);
		}
	
		// Power LED
		id = '#' + board + '-led_power';
		if (status['board']['power']) {
			$(id).addClass('led_green_on');
		} else {
			$(id).removeClass('led_green_on');
		}

		// Done LED
		id = '#' + board + '-led_done';
		if (status['board']['done']) {
			$(id).addClass('led_green_on');
		} else {
			$(id).removeClass('led_green_on');
		}

		// FPGA configuration
		id = '#' + board + '-bit_file_name';
		$(id).text(status['fpga']['bitname']);  // bitfilename

		id = '#' + board + '-config_time';
		$(id).text(status['fpga']['conftime']); // configuration time

		// Conf message
		id = '#' + board + '-msg';
		$(id).text(status['fpga']['memo']);					// FPGA configuration memo

		// Board ID
		id = '#' + board + '-board_id';
		$(id).text(status['board']['id']);					// FPGA configuration memo

		// Channel linkup
		if (status['board']['channel'] != 0x10000) {
			for (var i = 0; i < MAX_CHANNELS; i++) {
				id = '#' + board + '-led_ch' + i;
				if (status['board']['channel'] & (0x1 << i)) {
					$(id).removeClass('led_orange_on');
					$(id).addClass('led_green_on');
				} else {
					$(id).removeClass('led_green_on');
					$(id).addClass('led_orange_on');
				}
			}
		} else {
			for (var i = 0; i < MAX_CHANNELS; i++) {
				id = '#' + board + '-led_ch' + i;
				$(id).removeClass('led_orange_on');
				$(id).removeClass('led_green_on');
			}
		}


		// Packet counter
		for (var i = 0; i < MAX_PORTS; i++) {
			// Tempolary only for sw
			id = '#' + board + '-sw_pcr_in' + i;
			$(id).text(status['board']['pcr']['in'+i])

			id = '#' + board + '-sw_pcr_out' + i;
			$(id).text(status['board']['pcr']['out'+i])
		}
	}

	//-------------------------------------------------------------------------
	// button click event
	//-------------------------------------------------------------------------
	$(document).on('click', '.square_btn_orange, .square_btn_blue', function(e){
		var btn = $(this)[0];
		[board_id, elem_id] = btn.id.split('-')

		switch (elem_id) {
			case 'btn_fpga_reset':
				fpga_reset(board_id);
				get_status();
				break;
			case 'btn_hls_reset':
				hls_reset(board_id);
				break;
			case 'btn_hls_start':
				hls_start(board_id);
				break;
		}
	});

	//-------------------------------------------------------------------------
	// FPGA reset 
	//-------------------------------------------------------------------------
	function fpga_reset(board) {
		if (confirm("FPGA " + board + " will be initilizing, are you sure?")) {
			var url = board + '/fpga';
			$.ajax({
				url: url,
				type: 'delete',
				cache: false,
				contentType: 'application/json',
				dataType: 'json'
			})
				.done(function (data, textStatus, jqXHR) {
					if (data['return'] == 'success') {
					} else {
						alert(data['error']);
					}
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					alert('AJAX fail');
				});
		}
	}

	//-------------------------------------------------------------------------
	// HLS reset button click
	//-------------------------------------------------------------------------
	function hls_reset(board) {
		if (confirm("Are you sure?")) {
			var url = board + '/hls';
			var json = {
				"command": "reset",
			}
			$.ajax({
				url: url,
				type: 'post',
				data: JSON.stringify(json),
				cache: false,
				contentType: 'application/json',
				dataType: 'json',
				timeout: 50000
			})
			.done(function (data, textStatus, jqXHR) {
				if (data['return'] == 'success') {
				} else {
					alert(data['error']);
				}
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				alert('AJAX fail');
			});
		}
	}

	//-------------------------------------------------------------------------
	// HLS start button click
	//-------------------------------------------------------------------------
	function hls_start(board) {
		if (confirm("Are you sure?")) {
			var url = board + '/hls';
			var json = {
				"command" : "start",
			}
			$.ajax({
				url         : url,
				type        : 'post',
				data        : JSON.stringify(json),
				cache       : false,
				contentType : 'application/json',
				dataType    : 'json',
				timeout     : 50000
			})
			.done(function(data, textStatus, jqXHR){
				//alert(form_data);
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				alert('AJAX fail');
			});
		}
	}

	//----------------------------------------------------------------------------
	// obtain board status
	//----------------------------------------------------------------------------
	function get_board_status(board) {
		var url = board + '/status';
		console.log(url);
		$.ajax({
			url         : url,
			type        : 'get',
			cache       : false,
			dataType    : 'json',
			timeout     : 50000
		})
		.done(function(data, textStatus, jqXHR){
			console.log(data);
			if (data['return'] == 'success') {
				var status = data['status'];
				set_status(board, status);
			
			}
			//	$('#status_msg').text("get_status failed. FPGA may not configured yet?");		// configuration time
			//	//alert("get_status failed")
			//}
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			//alert("Ajax Error")
			console.log('ajax error at get_board_status');
			return null;
		});
	}

	//----------------------------------------------------------------------------
	// Every 60s
	//----------------------------------------------------------------------------
	tmr1 = setInterval(function(){
		//get_status();
		auto_get_status();
	}, 60000);
});

//----------------------------------------------------------------------------
function set_allow_reflesh(obj, board) {
	$jq(function($){
		var url = board + '/config';
		var json = {
			"auto_reflesh": obj.checked
		};
		$.ajax({
			url         : url,
			type        : 'post',
			data        : JSON.stringify(json),
			cache       : false,
			contentType : 'application/json',
			dataType    : 'json',
			timeout     : 10000
		})
		.done(function(form_data, textStatus, jqXHR){
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			alert('AJAX failed');
		});
	});
}

//----------------------------------------------------------------------------
function set_allow_gpio(obj, board) {
	$jq(function($){
		var url = board + '/config';
		var json = {
			"use_gpio": obj.checked
		};
		console.log(url)
		$.ajax({
			url         : url,
			type        : 'post',
			data        : JSON.stringify(json),
			cache       : false,
			contentType : 'application/json',
			dataType    : 'json',
			timeout     : 10000
		})
		.done(function(form_data, textStatus, jqXHR){
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			alert('AJAX failed');
		});
	});
}

