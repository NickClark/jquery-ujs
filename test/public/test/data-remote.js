module('data-remote', {

	teardown: App.teardown,

	setup: function() {
		$('#fixtures').append($('<a />', {
			href: App.url('show'),
			'data-remote': 'true',
			text: 'my address'
		}));

		$('#fixtures').append($('<input />', {
			href: App.url('show'),
			'data-remote': 'true',
			name: 'submit',
			type: 'submit',
			value: 'Click me'
		}));
		
    var form = $('<form />', {
			action: App.url('update'),
			'data-remote': 'true',
			method: 'post'
		});

		form.append($('<input />', {
			id: 'user_name',
			type: 'text',
			size: '30',
			'name': 'user_name',
			'value': 'john'
		}));

        form.append($('<input />', {
            id: "team_submit",
            type: "submit",
            name: "team", 
            value: "Team 1"
        }));

        form.append($('<button />', {
            id: "team_button",
            name: "team", 
            value: "Team 2"
        }));


    $('#fixtures').append(form);

	}
});

test('clicking on a link with data-remote attribute', function() {
  expect(3);
  stop(App.ajax_timeout);

  $('a[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');
      App.assert_get_request(request_env); 

      start();
    })
    .trigger('click');
});

test('clicking on Submit input tag with data-remote attribute', function() {
  expect(3);
  stop(App.ajax_timeout);

  $('input[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      var request_env = $.parseJSON(data)['request_env'];

      App.assert_request_path(request_env, '/show');
      App.assert_get_request(request_env); 

      start();
    })
    .trigger('click');
});

test('Submitting form with data-remote attribute', function() {
  expect(4);
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      var request_env = $.parseJSON(data)['request_env'],
          params = request_env['rack.request.query_hash'];

      App.assert_request_path(request_env, '/update');
      equals(params['user_name'], 'john', 'ajax arguments shouldh ave key user_name with right value');
      App.assert_post_request(request_env); 

      start();
    })
    .trigger('submit');
});

test('Submitting multi-button form with data-remote attribute using html input', function() {
  expect(5);
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      var request_env = $.parseJSON(data)['request_env'],
          params = request_env['rack.request.query_hash'];

      App.assert_request_path(request_env, '/update');
      equals(params['user_name'], 'john', 'ajax arguments should have key user_name with right value');
      equals(params['team'], 'Team 1', 'ajax arguments should have button key with right value');
      App.assert_post_request(request_env); 

    })
 
  $('form[data-remote] input[type=\'submit\']#team_submit').trigger('click');

  start();

});

test('Submitting multi-button form with data-remote attribute using html button', function() {
  expect(5);
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      var request_env = $.parseJSON(data)['request_env'],
          params = request_env['rack.request.query_hash'];

      App.assert_request_path(request_env, '/update');
      equals(params['user_name'], 'john', 'ajax arguments should have key user_name with right value');
      equals(params['team'], 'Team 2', 'ajax arguments should have button key with right value');
      App.assert_post_request(request_env); 

    })
 
  $('form[data-remote] button#team_button').trigger('click');

  start();

})
