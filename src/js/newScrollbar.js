(function()
{
	this.newScrollbar = {
        author: 'Philipp Heidrich',
        mail: 'phi.heidrich@gmail.com',
        site: 'https://github.com/tbl123/newScrollbar',
        version: '{{ VERSION }}'
    };

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
                    objects: {}
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

            // Kontent wieder einfügen
            var content = document.createElement('div');
            content.className = 'nsb-content';
            content.innerHTML = _inner;
            _obj.appendChild(content);

            _objects.content = content;

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
                }

                if(_axis == 'x')
                {
                    var scrollAreaX = document.createElement('div');
                    scrollAreaX.className = 'nsb-scrollArea nsb-scroll-x';
                    _obj.appendChild(scrollAreaX);

                    _objects.scrollAreaX = scrollAreaX;

                    _obj.className += ' scroll-x';
                }
            }
        }
    }


    /**
     *  Inital script
     **/
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
        });
    }

}).call(this);
