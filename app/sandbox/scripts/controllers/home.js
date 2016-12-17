// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

app.controller('HomeController', [
	'$scope',
	'$state',
    function ($scope, $state) {
        $(document).ready(function() {
        	// Destroy Fullpage
			if (typeof $.fn.fullpage.destroy === 'function') { 
			    $.fn.fullpage.destroy('all');
			}

			// Initialize Fullpage
			$('#fullpage').fullpage({
				sectionsColor: ['#ffffff', '#ffffff', '#414840', '#f0f4fa'],
				navigation: true,
				resize: true,
				continuousVertical: true
			});
		});
    }
]);