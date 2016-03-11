(function()
{
	this.newScrollbar = {
        author: 'Philipp Heidrich',
        mail: 'phi.heidrich@gmail.com',
        site: 'https://github.com/tbl123/newScrollbar',
        version: '{{ VERSION }}'
    };

	/**
	 *	Support Browser
	 **/
	newScrollbar.support = {};


    /**
     *  newScrollbar Objects
     **/
    newScrollbar.objects = {
        init: [],
        parse: []
    };


    /**
     *  newScrollbar options
     **/
    newScrollbar.options = {
        axis: ['y', 'x']
    }


	/**
	 *	Berechne Scrollthumb Höhe
	 **/
	newScrollbar.calcThumbSize = function(_obj)
	{
		var _childs = _obj.newScrollbar.objects,
			_options = _obj.newScrollbar.options;

		// Überprüfe Y - Achse
		var _heightScroll = _childs.contentScroll.offsetHeight,
			_heightContent = _childs.content.offsetHeight;

		// Inhalt ist höher als Content
		if(_heightScroll > _heightContent)
		{
			// Berechne Y - Achse
			_childs.scrollYThumb.style.height = Math.round((100 / _heightScroll) * _heightContent) + '%';
		}
		// Inhalt ist kleiner als Content
		else {
			_childs.scrollAreaY.className += ' nsb-inactive';
		}


		// Überprüfe X - Achse
		var _widthScroll = _childs.contentScroll.offsetWidth,
			_widthContent = _childs.content.offsetHeight;

		// Inhalt ist höher als Content
		if(_widthScroll > _widthContent)
		{
			// Berechne X - Achse
			_childs.scrollXThumb.style.width = Math.round((100 / _widthScroll) * _widthContent) + '%';
		}
		// Inhalt ist kleiner als Content
		else {
			_childs.scrollAreaX.className += ' nsb-inactive';
		}
	}


	/**
	 *	Check Browsersupport
	 **/
	newScrollbar.checkBrowser = function()
	{
		function check3d()
		{
			if(!window.getComputedStyle)
			{
		        return false;
		    }

		    var el = document.createElement('p'),
			    has3d,
			    transforms = {
			        'webkitTransform':'-webkit-transform',
			        'OTransform':'-o-transform',
			        'msTransform':'-ms-transform',
			        'MozTransform':'-moz-transform',
			        'transform':'transform'
			    };

		    // Add it to the body to get the computed style
		    document.body.insertBefore(el, null);

		    for(var t in transforms)
			{
		        if(el.style[t] !== undefined)
				{
		            el.style[t] = 'translate3d(1px,1px,1px)';
		            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
		        }
		    }

		    document.body.removeChild(el);

		    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
		}

		// Check 3D
		this.support.transform3D = check3d();
	}


    /**
     *  Push incomming objects in global array
     **/
    newScrollbar.pushObjects = function(obj, options)
    {
        var allHTMLObjects = document.querySelectorAll(obj.split(/\,/gi));

        for(var i = 0; i < allHTMLObjects.length; i++)
        {
            var _obj = allHTMLObjects[i];

            if(_obj.newScrollbar)
            {
                this.objects.parse.push(_obj);
            }
            else {
                this.objects.init.push(_obj);

                // Add object variable
                _obj.newScrollbar = {
                    options: this.options,
                    objects: {},
					events: {}
                };

                // Add own variables
                if(options)
                {
                    for(var _option in options)
                    {
                        _obj.newScrollbar.options[_option] = options[_option];
                    }
                }
            }
        }
    }


    /**
     *  Create scrollbar objects
     **/
    newScrollbar.createObjects = function()
    {
        for(var i = 0; i < this.objects.init.length; i++)
        {
            var _obj        = this.objects.init[i],
                _inner      = _obj.innerHTML,
                _objects    = _obj.newScrollbar.objects;

			_obj.className += ' newScrollbar';

            // Lösche Objeckt Inhalt
            _obj.innerHTML = '';

            var content = document.createElement('div');
            content.className = 'nsb-content';
            _obj.appendChild(content);

			_objects.content = content;

			// Kontent wieder einfügen
            var contentScroll = document.createElement('div');
            contentScroll.className = 'nsb-content-scroll';
            contentScroll.innerHTML = _inner;
            content.appendChild(contentScroll);

            _objects.contentScroll = contentScroll;

            // Scrollbar area
            for(var e = 0; e < _obj.newScrollbar.options.axis.length; e++)
            {
                var _axis = _obj.newScrollbar.options.axis[e];

                if(_axis == 'y')
                {
                    var scrollAreaY = document.createElement('div');
                    scrollAreaY.className = 'nsb-scrollArea nsb-scroll-y';
                    _obj.appendChild(scrollAreaY);

                    _objects.scrollAreaY = scrollAreaY;

                    _obj.className += ' scroll-y';

					// Scroll inner
                    var scrollYInner = document.createElement('div');
                    scrollYInner.className = 'nsb-sc-inner';
                    scrollAreaY.appendChild(scrollYInner);

                    _objects.scrollYInner = scrollYInner;

					// Scroll thumb
                    var scrollYThumb = document.createElement('div');
                    scrollYThumb.className = 'nsb-sc-in-thumb';
					scrollYThumb.onmousedown = function(event)
					{
						newScrollbar.initalEventScroll(_obj, 'y', event);
					};
                    scrollYInner.appendChild(scrollYThumb);

                    _objects.scrollYThumb = scrollYThumb;
                }

                if(_axis == 'x')
                {
                    var scrollAreaX = document.createElement('div');
                    scrollAreaX.className = 'nsb-scrollArea nsb-scroll-x';
                    _obj.appendChild(scrollAreaX);

                    _objects.scrollAreaX = scrollAreaX;

                    _obj.className += ' scroll-x';

					// Scroll inner
					var scrollXInner = document.createElement('div');
                    scrollXInner.className = 'nsb-sc-inner';
                    scrollAreaX.appendChild(scrollXInner);

                    _objects.scrollXInner = scrollXInner;

					// Scroll thumb
                    var scrollXThumb = document.createElement('div');
                    scrollXThumb.className = 'nsb-sc-in-thumb';
					scrollYThumb.onmousedown = function(event)
					{
						newScrollbar.initalEventScroll(_obj, 'x', event);
					};
                    scrollXInner.appendChild(scrollXThumb);

                    _objects.scrollXThumb = scrollXThumb;
                }
            }
        }
    }


	/**
	 *	Initalisiere Scrollfunktionen
	 **/
	newScrollbar.initalScrollFunc = function()
	{
		for(var i = 0; i < this.objects.init.length; i++)
        {
			var _obj 		= this.objects.init[i],
				_options 	= _obj.newScrollbar.options,
				_childs 	= _obj.newScrollbar.objects;

			// Berechne Thumb Scroller
			newScrollbar.calcThumbSize(_obj);
		}
	}


	/**
	 *	Funktion fürs scrollen
	 **/
	newScrollbar.initalEventScroll = function(_obj, axis, event)
	{
		var _childs = _obj.newScrollbar.objects;

		// Setzte Klasse
		_obj.className += ' scrollMe-scroll';

		if(axis === 'y')
		{
			_childs.scrollAreaY.className += ' scrollMe-scroll';
		}

		if(axis === 'x')
		{
			_childs.scrollAreaX.className += ' scrollMe-scroll';
		}
	}






    /**
     *  Events
     **/
	// Event -> onmouseup
	document.addEventListener("mouseup", function(event)
	{
		for(var i = 0; i < newScrollbar.objects.parse.length; i++)
		{
			var _obj = newScrollbar.objects.parse[i],
				_event = _obj.newScrollbar.events,
				_childs = _obj.newScrollbar.objects;

			if(_event.move)
			{
				// Klassen nehmen
				_childs.scrollAreaY.className = _childs.scrollAreaY.className.replace(/ scrollMe-scroll/gi, '');
				_childs.scrollAreaX.className = _childs.scrollAreaX.className.replace(' scrollMe-scroll', '');
			}
		}
	});

	// Dom onload
	document.addEventListener("DOMContentLoaded", function(event)
	{
		newScrollbar.checkBrowser();
	});

    newScrollbar.init = function(obj, options)
    {
        window.addEventListener('load', function()
        {
            // Prüfen ob benötigte Werte angegeben wurden
            if(!obj)
            {
                return;
            }

            // Save HTML objects
            newScrollbar.pushObjects(obj, options);

            // Create Objects
            newScrollbar.createObjects();

			// Initalisiere Scroll Funktion
			newScrollbar.initalScrollFunc();

			// Füge alle erstellten Elemente in das fertig Array hinzu
			for(var i = 0; i < newScrollbar.objects.init.length; i++)
			{
				newScrollbar.objects.parse.push(newScrollbar.objects.init[i]);
			}

			// Lösche Init Array
			newScrollbar.objects.init.length = 0;
        });
    }

}).call(this);

//# sourceMappingURL=newScrollbar.js.map