const LiteGraph: any = {
  VERSION: 0.4,

  CANVAS_GRID_SIZE: 10,

  NODE_TITLE_HEIGHT: 30,
  NODE_TITLE_TEXT_Y: 20,
  NODE_SLOT_HEIGHT: 20,
  NODE_WIDGET_HEIGHT: 20,
  NODE_WIDTH: 140,
  NODE_MIN_WIDTH: 50,
  NODE_COLLAPSED_RADIUS: 10,
  NODE_COLLAPSED_WIDTH: 80,
  NODE_TITLE_COLOR: '#999',
  NODE_SELECTED_TITLE_COLOR: '#FFF',
  NODE_TEXT_SIZE: 12,
  NODE_TEXT_COLOR: '#AAA',
  NODE_SUBTEXT_SIZE: 12,
  NODE_DEFAULT_COLOR: '#333',
  NODE_DEFAULT_BGCOLOR: '#353535',
  NODE_DEFAULT_BOXCOLOR: '#666',
  NODE_DEFAULT_SHAPE: 'box',
  NODE_BOX_OUTLINE_COLOR: '#FFF',
  DEFAULT_SHADOW_COLOR: 'rgba(0,0,0,0.5)',
  DEFAULT_GROUP_FONT: 24,

  WIDGET_BGCOLOR: '#222',
  WIDGET_OUTLINE_COLOR: '#666',
  WIDGET_TEXT_COLOR: '#DDD',
  WIDGET_SECONDARY_TEXT_COLOR: '#999',

  LINK_COLOR: '#9A9',
  EVENT_LINK_COLOR: '#A86',
  CONNECTING_LINK_COLOR: '#AFA',

  MAX_NUMBER_OF_NODES: 1000, //avoid infinite loops
  DEFAULT_POSITION: [100, 100], //default node position
  VALID_SHAPES: ['default', 'box', 'round', 'card'], //,"circle"

  //shapes are used for nodes but also for slots
  BOX_SHAPE: 1,
  ROUND_SHAPE: 2,
  CIRCLE_SHAPE: 3,
  CARD_SHAPE: 4,
  ARROW_SHAPE: 5,
  GRID_SHAPE: 6, // intended for slot arrays

  //enums
  INPUT: 1,
  OUTPUT: 2,

  EVENT: -1, //for outputs
  ACTION: -1, //for inputs

  NODE_MODES: ['Always', 'On Event', 'Never', 'On Trigger'], // helper, will add "On Request" and more in the future
  NODE_MODES_COLORS: ['#666', '#422', '#333', '#224', '#626'], // use with node_box_coloured_by_mode
  ALWAYS: 0,
  ON_EVENT: 1,
  NEVER: 2,
  ON_TRIGGER: 3,

  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  CENTER: 5,

  LINK_RENDER_MODES: ['Straight', 'Linear', 'Spline'], // helper
  STRAIGHT_LINK: 0,
  LINEAR_LINK: 1,
  SPLINE_LINK: 2,

  NORMAL_TITLE: 0,
  NO_TITLE: 1,
  TRANSPARENT_TITLE: 2,
  AUTOHIDE_TITLE: 3,
  VERTICAL_LAYOUT: 'vertical', // arrange nodes vertically

  proxy: null, //used to redirect calls
  node_images_path: '',

  debug: false,
  catch_exceptions: true,
  throw_errors: true,
  allow_scripts: false, //if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration), which could lead to exploits
  registered_node_types: {} as any, //nodetypes by string
  node_types_by_file_extension: {} as any, //used for dropping files in the canvas
  Nodes: {} as any, //node types by classname
  Globals: {} as any, //used to store vars between graphs

  searchbox_extras: {} as any, //used to add extra features to the search box
  auto_sort_node_types: false, // [true!] If set to true, will automatically sort node types / categories in the context menus

  node_box_coloured_when_on: false, // [true!] this make the nodes box (top left circle) coloured when triggered (execute/action), visual feedback
  node_box_coloured_by_mode: false, // [true!] nodebox based on node mode, visual feedback

  dialog_close_on_mouse_leave: true, // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
  dialog_close_on_mouse_leave_delay: 500,

  shift_click_do_break_link_from: false, // [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys
  click_do_break_link_to: false, // [false!]prefer false, way too easy to break links

  search_hide_on_mouse_leave: true, // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
  search_filter_enabled: false, // [true!] enable filtering slots type in the search widget, !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
  search_show_all_on_open: true, // [true!] opens the results list when opening the search widget

  auto_load_slot_types: false, // [if want false, use true, run, get vars values to be statically set, than disable] nodes types and nodeclass association with node types need to be calculated, if dont want this, calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]

  // set these values if not using auto_load_slot_types
  registered_slot_in_types: {} as any, // slot types for nodeclass
  registered_slot_out_types: {} as any, // slot types for nodeclass
  slot_types_in: [] as any[], // slot types IN
  slot_types_out: [] as any[], // slot types OUT
  slot_types_default_in: [] as any[], // specify for each IN slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search
  slot_types_default_out: [] as any[], // specify for each OUT slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search

  alt_drag_do_clone_nodes: false, // [true!] very handy, ALT click to clone and drag the new node

  do_add_triggers_slots: false, // [true!] will create and connect event slots when using action/events connections, !WILL CHANGE node mode when using onTrigger (enable mode colors), onExecuted does not need this

  allow_multi_output_for_events: true, // [false!] being events, it is strongly reccomended to use them sequentially, one by one

  middle_click_slot_add_default_node: false, //[true!] allows to create and connect a ndoe clicking with the third button (wheel)

  release_link_on_empty_shows_menu: false, //[true!] dragging a link to empty space will open a menu, add from list, search or defaults

  pointerevents_method: 'mouse', // "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now)
  // TODO implement pointercancel, gotpointercapture, lostpointercapture, (pointerover, pointerout if necessary)

  ctrl_shift_v_paste_connect_unselected_outputs: false, //[true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected with the inputs of the newly pasted nodes

  // if true, all newly created nodes/links will use string UUIDs for their id fields instead of integers.
  // use this if you must have node IDs that are unique across all graphs and subgraphs.
  use_uuids: false,

  /**
   * removes a node type from the system
   * @method unregisterNodeType
   * @param {String|Object} type name of the node or the node constructor itself
   */
  unregisterNodeType: function (type: any) {
    // @ts-ignore
    const base_class = type.constructor === String ? this.registered_node_types[type] : type
    if (!base_class) {
      throw 'node type not found: ' + type
    }
    delete this.registered_node_types[base_class.type]
    if (base_class.constructor.name) {
      delete this.Nodes[base_class.constructor.name]
    }
  },

  /**
   * Save a slot type and his node
   * @method registerSlotType
   * @param {String|Object} type name of the node or the node constructor itself
   * @param {String} slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
   */
  registerNodeAndSlotType: function (type: any, slot_type: string, out?: boolean) {
    out = out || false
    // @ts-ignore
    const base_class = type.constructor === String && this.registered_node_types[type] !== 'anonymous' ? this.registered_node_types[type] : type

    const class_type = base_class.constructor.type

    let allTypes = []
    if (typeof slot_type === 'string') {
      allTypes = slot_type.split(',')
    } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
      allTypes = ['_event_']
    } else {
      allTypes = ['*']
    }

    for (let i = 0; i < allTypes.length; ++i) {
      let slotType = allTypes[i]
      if (slotType === '') {
        slotType = '*'
      }
      const registerTo = out ? 'registered_slot_out_types' : 'registered_slot_in_types'
      if (this[registerTo][slotType] === undefined) {
        this[registerTo][slotType] = { nodes: [] }
      }
      if (!this[registerTo][slotType].nodes.includes(class_type)) {
        this[registerTo][slotType].nodes.push(class_type)
      }

      // check if is a new type
      if (!out) {
        if (!this.slot_types_in.includes(slotType.toLowerCase())) {
          this.slot_types_in.push(slotType.toLowerCase())
          this.slot_types_in.sort()
        }
      } else {
        if (!this.slot_types_out.includes(slotType.toLowerCase())) {
          this.slot_types_out.push(slotType.toLowerCase())
          this.slot_types_out.sort()
        }
      }
    }
  },

  /**
   * Create a new nodetype by passing a function, it wraps it with a proper class and generates inputs according to the parameters of the function.
   * Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
   * @method wrapFunctionAsNode
   * @param {String} name node name with namespace (p.e.: 'math/sum')
   * @param {Function} func
   * @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
   * @param {String} return_type [optional] string with the return type, otherwise it will be generic
   * @param {Object} properties [optional] properties to be configurable
   */
  wrapFunctionAsNode: function (name: string, func: any, param_types?: any[], return_type?: string, properties?: any) {
    var params = Array(func.length)
    var code = ''
    // @ts-ignore
    var names = LiteGraph.getParameterNames(func)
    for (var i = 0; i < names.length; ++i) {
      code += "this.addInput('" + names[i] + "'," + (param_types && param_types[i] ? "'" + param_types[i] + "'" : '0') + ');\n'
    }
    code += "this.addOutput('out'," + (return_type ? "'" + return_type + "'" : 0) + ');\n'
    if (properties) {
      code += 'this.properties = ' + JSON.stringify(properties) + ';\n'
    }
    var classobj: any = Function(code)
    classobj.title = name.split('/').pop()
    classobj.desc = 'Generated from ' + func.name
    classobj.prototype.onExecute = function onExecute() {
      for (var i = 0; i < params.length; ++i) {
        params[i] = this.getInputData(i)
      }
      var r = func.apply(this, params)
      this.setOutputData(0, r)
    }
    // @ts-ignore
    this.registerNodeType(name, classobj)
  },

  /**
   * Removes all previously registered node's types
   */
  clearRegisteredTypes: function () {
    this.registered_node_types = {}
    this.node_types_by_file_extension = {}
    this.Nodes = {}
    this.searchbox_extras = {}
  },

  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @method createNode
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @param {String} name a name to distinguish from other nodes
   * @param {Object} options to set options
   */

  createNode: function (type: string, title: string, options: any) {
    var base_class = this.registered_node_types[type]

    if (!base_class) {
      console.error('GraphNode type "' + type + '" not registered.')
      return null
    }

    var prototype = base_class.prototype || base_class

    title = title || base_class.title || type

    var node = null

    if (LiteGraph.catch_exceptions) {
      try {
        node = new base_class(title)
      } catch (err) {
        console.error(err)
        return null
      }
    } else {
      node = new base_class(title)
    }

    node.type = type

    if (!node.title && title) {
      node.title = title
    }
    if (!node.properties) {
      node.properties = {}
    }
    if (!node.properties_info) {
      node.properties_info = []
    }
    if (!node.flags) {
      node.flags = {}
    }
    if (!node.size) {
      node.size = node.computeSize()
      //call onresize?
    }
    if (!node.pos) {
      node.pos = LiteGraph.DEFAULT_POSITION.concat()
    }
    if (!node.mode) {
      node.mode = LiteGraph.ALWAYS
    }

    node.docked = false

    //extra options
    if (options) {
      for (var i in options) {
        node[i] = options[i]
      }
    }

    // callback
    if (node.onNodeCreated) {
      node.onNodeCreated()
    }
    return node
  },

  /**
   * Returns a registered node type with a given name
   * @method getNodeType
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @return {Class} the node class
   */
  getNodeType: function (type: string) {
    return this.registered_node_types[type]
  },

  /**
   * Returns a list of node types matching one category
   * @method getNodeType
   * @param {String} category category name
   * @return {Array} array with all the node classes
   */

  getNodeTypesInCategory: function (category: string, filter: any) {
    var r = []
    for (var i in this.registered_node_types) {
      var type = this.registered_node_types[i]
      if (type.filter != filter) {
        continue
      }

      if (category == '') {
        if (type.category == null) {
          r.push(type)
        }
      } else if (type.category == category) {
        r.push(type)
      }
    }

    if (this.auto_sort_node_types) {
      r.sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })
    }

    return r
  },

  /**
   * Returns a list with all the node type categories
   * @method getNodeTypesCategories
   * @param {String} filter only nodes with ctor.filter equal can be shown
   * @return {Array} array with all the names of the categories
   */
  getNodeTypesCategories: function (filter: string) {
    var categories: any = { '': 1 }
    for (var i in this.registered_node_types) {
      var type = this.registered_node_types[i]
      if (type.category && !type.skip_list) {
        if (type.filter != filter) continue
        categories[type.category] = 1
      }
    }
    var result = []
    for (var i in categories) {
      result.push(i)
    }
    return this.auto_sort_node_types ? result.sort() : result
  },

  //debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes: function (folder_wildcard: any) {
    var tmp = document.getElementsByTagName('script')
    //weird, this array changes by its own, so we use a copy
    var script_files = []
    for (var i = 0; i < tmp.length; i++) {
      script_files.push(tmp[i])
    }

    var docHeadObj = document.getElementsByTagName('head')[0]
    folder_wildcard = document.location.href + folder_wildcard

    for (var i = 0; i < script_files.length; i++) {
      var src = script_files[i].src
      if (!src || src.substr(0, folder_wildcard.length) != folder_wildcard) {
        continue
      }

      try {
        if (LiteGraph.debug) {
          console.log('Reloading: ' + src)
        }
        var dynamicScript = document.createElement('script')
        dynamicScript.type = 'text/javascript'
        dynamicScript.src = src
        docHeadObj.appendChild(dynamicScript)
        docHeadObj.removeChild(script_files[i])
      } catch (err) {
        if (LiteGraph.throw_errors) {
          throw err
        }
        if (LiteGraph.debug) {
          console.log('Error while reloading ' + src)
        }
      }
    }

    if (LiteGraph.debug) {
      console.log('Nodes reloaded')
    }
  },

  //separated just to improve if it doesn't work
  cloneObject: function (obj: any, target: any) {
    if (obj == null) {
      return null
    }
    var r = JSON.parse(JSON.stringify(obj))
    if (!target) {
      return r
    }

    for (var i in r) {
      target[i] = r[i]
    }
    return target
  },

  /*
   * https://gist.github.com/jed/982883?permalink_comment_id=852670#gistcomment-852670
   */
  uuidv4: function () {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) => (a ^ ((Math.random() * 16) >> (a / 4))).toString(16))
  },

  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @method isValidConnection
   * @param {String} type_a
   * @param {String} type_b
   * @return {Boolean} true if they can be connected
   */
  isValidConnection: function (type_a: any, type_b: any) {
    if (type_a == '' || type_a === '*') type_a = 0
    if (type_b == '' || type_b === '*') type_b = 0
    if (
      !type_a || //generic output
      !type_b || // generic input
      type_a == type_b || //same type (is valid for triggers)
      (type_a == LiteGraph.EVENT && type_b == LiteGraph.ACTION)
    ) {
      return true
    }

    // Enforce string type to handle toLowerCase call (-1 number not ok)
    type_a = String(type_a)
    type_b = String(type_b)
    type_a = type_a.toLowerCase()
    type_b = type_b.toLowerCase()

    // For nodes supporting multiple connection types
    if (type_a.indexOf(',') == -1 && type_b.indexOf(',') == -1) {
      return type_a == type_b
    }

    // Check all permutations to see if one is valid
    var supported_types_a = type_a.split(',')
    var supported_types_b = type_b.split(',')
    for (var i = 0; i < supported_types_a.length; ++i) {
      for (var j = 0; j < supported_types_b.length; ++j) {
        if (this.isValidConnection(supported_types_a[i], supported_types_b[j])) {
          //if (supported_types_a[i] == supported_types_b[j]) {
          return true
        }
      }
    }

    return false
  },

  /**
   * Register a string in the search box so when the user types it it will recommend this node
   * @method registerSearchboxExtra
   * @param {String} node_type the node recommended
   * @param {String} description text to show next to it
   * @param {Object} data it could contain info of how the node should be configured
   * @return {Boolean} true if they can be connected
   */
  registerSearchboxExtra: function (node_type: string, description: string, data: any) {
    this.searchbox_extras[description.toLowerCase()] = {
      type: node_type,
      desc: description,
      data: data,
    }
  },

  /**
   * Wrapper to load files (from url using fetch or from file using FileReader)
   * @method fetchFile
   * @param {String|File|Blob} url the url of the file (or the file itself)
   * @param {String} type an string to know how to fetch it: "text","arraybuffer","json","blob"
   * @param {Function} on_complete callback(data)
   * @param {Function} on_error in case of an error
   * @return {FileReader|Promise} returns the object used to
   */
  fetchFile: function (url: any, type: string, on_complete: any, on_error: any) {
    var that = this
    if (!url) return null

    type = type || 'text'
    if (url.constructor === String) {
      if (url.substr(0, 4) == 'http' && LiteGraph.proxy) {
        url = LiteGraph.proxy + url.substr(url.indexOf(':') + 3)
      }
      return fetch(url)
        .then(function (response) {
          if (!response.ok) throw new Error('File not found') //it will be catch below
          if (type == 'arraybuffer') return response.arrayBuffer()
          else if (type == 'text' || type == 'string') return response.text()
          else if (type == 'json') return response.json()
          else if (type == 'blob') return response.blob()
        })
        .then(function (data) {
          if (on_complete) on_complete(data)
        })
        .catch(function (error) {
          console.error('error fetching file:', url)
          if (on_error) on_error(error)
        })
    } else if (url.constructor === File || url.constructor === Blob) {
      var reader = new FileReader()
      reader.onload = function (e) {
        var v = e.target!.result
        // @ts-ignore
        if (type == 'json') v = JSON.parse(v)
        if (on_complete) on_complete(v)
      }
      if (type == 'arraybuffer') return reader.readAsArrayBuffer(url)
      else if (type == 'text' || type == 'json') return reader.readAsText(url)
      else if (type == 'blob') return reader.readAsBinaryString(url)
    }
    return null
  },
  //used to create nodes from wrapping functions
  getParameterNames: function (func: any) {
    return (func + '')
      .replace(/[/][/].*$/gm, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  /**/
      .split('){', 1)[0]
      .replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',')
      .filter(Boolean) // split & filter [""]
  },

  /* helper for interaction: pointer, touch, mouse Listeners
  used by LCanvas DragAndScale ContextMenu*/
  pointerListenerAdd: function (oDOM: any, sEvIn: any, fCall: any, capture = false) {
    if (!oDOM || !oDOM.addEventListener || !sEvIn || typeof fCall !== 'function') {
      //console.log("cant pointerListenerAdd "+oDOM+", "+sEvent+", "+fCall);
      return // -- break --
    }

    var sMethod = LiteGraph.pointerevents_method
    var sEvent = sEvIn

    // UNDER CONSTRUCTION
    // convert pointerevents to touch event when not available
    if (sMethod == 'pointer' && !window.PointerEvent) {
      console.warn("sMethod=='pointer' && !window.PointerEvent")
      console.log('Converting pointer[' + sEvent + '] : down move up cancel enter TO touchstart touchmove touchend, etc ..')
      switch (sEvent) {
        case 'down': {
          sMethod = 'touch'
          sEvent = 'start'
          break
        }
        case 'move': {
          sMethod = 'touch'
          //sEvent = "move";
          break
        }
        case 'up': {
          sMethod = 'touch'
          sEvent = 'end'
          break
        }
        case 'cancel': {
          sMethod = 'touch'
          //sEvent = "cancel";
          break
        }
        case 'enter': {
          console.log('debug: Should I send a move event?') // ???
          break
        }
        // case "over": case "out": not used at now
        default: {
          console.warn('PointerEvent not available in this browser ? The event ' + sEvent + ' would not be called')
        }
      }
    }

    switch (sEvent) {
      //both pointer and move events
      case 'down':
      case 'up':
      case 'move':
      case 'over':
      case 'out':
      case 'enter': {
        oDOM.addEventListener(sMethod + sEvent, fCall, capture)
      }
      // only pointerevents
      case 'leave':
      case 'cancel':
      case 'gotpointercapture':
      case 'lostpointercapture': {
        if (sMethod != 'mouse') {
          return oDOM.addEventListener(sMethod + sEvent, fCall, capture)
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.addEventListener(sEvent, fCall, capture)
    }
  },

  pointerListenerRemove: function (oDOM: any, sEvent: any, fCall: any, capture = false) {
    if (!oDOM || !oDOM.removeEventListener || !sEvent || typeof fCall !== 'function') {
      //console.log("cant pointerListenerRemove "+oDOM+", "+sEvent+", "+fCall);
      return // -- break --
    }
    switch (sEvent) {
      //both pointer and move events
      case 'down':
      case 'up':
      case 'move':
      case 'over':
      case 'out':
      case 'enter': {
        if (LiteGraph.pointerevents_method == 'pointer' || LiteGraph.pointerevents_method == 'mouse') {
          oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture)
        }
      }
      // only pointerevents
      case 'leave':
      case 'cancel':
      case 'gotpointercapture':
      case 'lostpointercapture': {
        if (LiteGraph.pointerevents_method == 'pointer') {
          return oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture)
        }
      }
      // not "pointer" || "mouse"
      default:
        return oDOM.removeEventListener(sEvent, fCall, capture)
    }
  }

}
export { LiteGraph }
