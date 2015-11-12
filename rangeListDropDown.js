var PriceRange = (function($){
    
    if(typeof $ === 'undefined')
            console.log('this requires jQuery');
    
    var priceRange = '#price_range',
        dropdownToggle = '#price_range .dropdown-toggle',
        listMin = '#price_range .range-list .list-min',
        inputMax = '#price_range .min-max .max';

    var Dropdown = {
        /**
         * toggleOpen
         * show the list
         * focus to min and show its lists
         * 
         * @returns {home_content_L37.Dropdown}
         */
        toggleOpen : function(){
            $(this).parent().toggleClass("open");
            $(listMin)
                    .removeClass('hidden')
                    .siblings().addClass('hidden');

            return this;
        },
        /**
         * when list is click
         * FIRE ME!!
         * @returns {home_content_L37.Dropdown}
         */
        listClick : function(){
            var $this = $(this);
            $this
                    .addClass('current-item') // set item active
                    .siblings().removeClass('current-item'); // remove siblings power

            var parent = $this.parent(),
                selector =  parent.hasClass('list-min') ? 'min' : 'max' ;
            $('#price_range .min-max input[name="' + selector +'"]' ).val($this.attr('data-val')); // set value of the field

            if( selector === 'min' ) // min, hide min, show max's list
            {
                parent
                        .addClass('hidden')
                        .siblings().removeClass('hidden');
                $(inputMax).focus();
                Dropdown.clearList($('#price_range .min-max .max'));
            }
            else // max, close the list
                $(priceRange).removeClass('open');

            Dropdown
                    .containerText()
                    .filterList();

            return this;
        },
        /**
         * Clear the list
         * remove active current-items
         * @param {type} $this
         * @returns {home_content_L37.Dropdown}
         */
        clearList : function($this){
            var selector = $this.hasClass('min') ? 'min' : 'max';
            $('#price_range .range-list .list-'+selector+' li').removeClass('current-item');
            Dropdown.filterList();
            return this;
        },
        /** 
         * filterList
         * filter the max's list
         * using min value
         * 
         * @returns {home_content_L37.Dropdown}
         */
        filterList : function(){
            var filter = $('#price_range .min-max .min').val();
            $('#price_range .range-list .list-max li')
                    .removeClass('hidden')
                    .each(function(){
                        var $this = $(this);
                        if( $this.attr('data-val') !== 'Any' && Body.txtInt($this.attr('data-val')) <= Body.txtInt(filter) )
                            $this.addClass('hidden');
                    });

            return this;
        },
        /**
         * dropdown's text
         * @returns {home_content_L37.Dropdown}
         */
        containerText : function(){
            var $minMax = $('#price_range .min-max'),
                min = $minMax.find('.min').val(),
                max = $minMax.find('.max').val(),
                text = 'Price';


                if( min !== '' && max !== '')
                    text = min + ' - ' + max;
                else if( min !== '' || max !== '' )
                    text = min === '' ? '0 - ' + max : min;

            $(priceRange + ' .dropdown-toggle span').html('<b>?</b> ' + text);

            return this;
        },
        /**
         * hide show the list items
         * depending on the active field
         * 
         * @param {type} e
         * @returns {undefined}
         */
        showList : function(e){
            var selector = $(this).hasClass('min') ? 'min' : 'max';
            $('#price_range .range-list .list-'+selector)
                    .removeClass('hidden')
                    .siblings().addClass('hidden');
        },
    };     

    var Body = {
        /**
         * listen to every click 
         * inside the body
         * 
         * @param {type} e
         * @returns {Body}
         */
        allClick : function(e) {
            var $priceRange = $(priceRange);
            if ( ! $priceRange.is(e.target) 
                    && $priceRange.has(e.target).length === 0 
                    && $('.open').has(e.target).length === 0) {
                    $priceRange.removeClass('open');
            }

            return this;
        },
        /**
         * remove `,` and return its integer value
         * 
         * @param {type} str
         * @returns {int}
         */
        txtInt :function (str) {
            str = str.replace(/,/g, "");
            return parseInt(str);
        }
    };

    /**
     * events that needs to be fired
     * 
     * @returns {undefined}
     */
    var bindEvents = function() {
        $('body')
                .on('click', Body.allClick)
                .on('click', dropdownToggle, Dropdown.toggleOpen)
                .on('click', '#price_range .range-list li', Dropdown.listClick)
                .on('focus', '#price_range .min-max input', Dropdown.showList)
                .on('keyup', '#price_range .min-max input', function(){
                    Dropdown
                        .clearList($(this))
                        .containerText();
                })
        ;
    },

    // init the events
    // run on load
    init = $(function() {
        bindEvents();
    });

    return {
        Dropdown: Dropdown,
        Body:Body
    };
})(jQuery);