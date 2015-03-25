(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FileNavigator;

FileNavigator = function(file, options) {
  var decode, getProgress, lastPosition, navigator, readChunk, self, size;
  self = this;
  size = file.size;
  file.navigator = this;
  lastPosition = 0;
  getProgress = function() {
    var progress;
    if (!size || size === 0) {
      return 0;
    }
    progress = parseInt(100 * lastPosition / size);
    if (progress > 100) {
      return 100;
    } else {
      return progress;
    }
  };
  readChunk = function(offset, length, callback) {
    var reader;
    lastPosition = offset + length;
    reader = new FileReader;
    reader.onloadend = function(progress) {
      var buffer;
      buffer = void 0;
      if (reader.result) {
        buffer = new Int8Array(reader.result, 0);
        buffer.slice = buffer.subarray;
      }
      callback(progress.err, buffer, progress.loaded);
    };
    reader.readAsArrayBuffer(file.slice(offset, offset + length));
  };
  decode = function(buffer, callback) {
    var reader;
    reader = new FileReader;
    reader.onloadend = function(progress) {
      callback(progress.currentTarget.result);
    };
    reader.readAsText(new Blob([buffer]));
  };
  navigator = new LineNavigator(readChunk, decode, options);
  self.getMilestones = navigator.getMilestones;
  self.readSomeLines = function(index, callback) {
    navigator.readSomeLines(index, function(err, index, lines, eof) {
      callback(err, index, lines, eof, getProgress());
    });
  };
  self.readLines = function(index, count, callback) {
    navigator.readLines(index, count, function(err, index, lines, eof) {
      callback(err, index, lines, eof, getProgress());
    });
  };
  self.find = navigator.find;
  self.findAll = navigator.findAll;
  self.getSize = function(callback) {
    return callback(file ? file.size : 0);
  };
};

module.exports = FileNavigator;



},{}],2:[function(require,module,exports){
var FileNavigator, file, index, indexToStartWith, init_ui, linesReadHandler, lines_in_batch, navigator, options, prepare_json, process_lines, readFile, send_to_server, show_progress, type, url;

FileNavigator = require('./filenavigator.coffee');

show_progress = function(progress, number) {
  var bar;
  bar = $(".progress-bar");
  bar.css("width", progress + "%");
  bar.text(progress + "%");
  $('#counter').text(number);
  return console.log(number + " : lines " + progress);
};

url = "http://localhost:9200/";

index = "govwiki";

type = "govs";

navigator = void 0;

file = void 0;

lines_in_batch = 5000;

indexToStartWith = 0;

options = {
  chunkSize: 1024 * 16
};

init_ui = function() {
  file = document.getElementById('chooseFileButton').files[0];
  return show_progress(0, 0);
};

prepare_json = function(index, lines) {
  return ["some", "json"];
};

send_to_server = function(index, lines, eof, progress, json) {
  return setTimeout((function(_this) {
    return function() {
      show_progress(progress, index + lines.length);
      console.log("sended json: " + json);
      if (eof) {
        return;
      }
      navigator.readLines(index + lines.length, lines_in_batch, linesReadHandler);
    };
  })(this), 1000);
};

process_lines = function(index, lines, eof, progress) {
  var json;
  json = prepare_json(index, lines);
  return send_to_server(index, lines, eof, progress, json);
};

linesReadHandler = function(err, index, lines, eof, progress) {
  if (err) {
    return;
  }
  process_lines(index, lines, eof, progress);
};

readFile = function() {
  navigator = new FileNavigator(file, options);
  navigator.readLines(indexToStartWith, lines_in_batch, linesReadHandler);
};

$('#chooseFileButton').change((function(_this) {
  return function() {
    return init_ui();
  };
})(this));

$('#readFileButton').click((function(_this) {
  return function() {
    return readFile();
  };
})(this));



},{"./filenavigator.coffee":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3ZhZGltaXZsZXYvUHJvamVjdHMvX3Byb2plY3RzL2VsYXN0aWNzZWFyY2gtZGF0YS1sb2FkZXIvY29mZmVlL2ZpbGVuYXZpZ2F0b3IuY29mZmVlIiwiL1VzZXJzL3ZhZGltaXZsZXYvUHJvamVjdHMvX3Byb2plY3RzL2VsYXN0aWNzZWFyY2gtZGF0YS1sb2FkZXIvY29mZmVlL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDUUEsSUFBQSxhQUFBOztBQUFBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ2QsTUFBQSxtRUFBQTtBQUFBLEVBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLEVBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxJQURaLENBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxTQUFMLEdBQWlCLElBRmpCLENBQUE7QUFBQSxFQUlBLFlBQUEsR0FBZSxDQUpmLENBQUE7QUFBQSxFQU1BLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixRQUFBLFFBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxJQUFBLElBQVMsSUFBQSxLQUFRLENBQXBCO0FBQ0UsYUFBTyxDQUFQLENBREY7S0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLFFBQUEsQ0FBUyxHQUFBLEdBQU0sWUFBTixHQUFxQixJQUE5QixDQUZYLENBQUE7QUFHQSxJQUFBLElBQUcsUUFBQSxHQUFXLEdBQWQ7YUFBdUIsSUFBdkI7S0FBQSxNQUFBO2FBQWdDLFNBQWhDO0tBSlk7RUFBQSxDQU5kLENBQUE7QUFBQSxFQWdCQSxTQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixRQUFqQixHQUFBO0FBQ1YsUUFBQSxNQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsTUFBQSxHQUFT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QTRCLEdBQTVCLEVBQWlDLFFBQWpDLENBREEsQ0FEaUI7QUFBQSxDQWpEbkIsQ0FBQTs7QUFBQSxRQXVEQSxHQUFXLFNBQUEsR0FBQTtBQUNULEVBQUEsU0FBQSxHQUFnQixJQUFBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLE9BQXBCLENBQWhCLENBQUE7QUFBQSxFQUNBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLGdCQUFwQixFQUFzQyxjQUF0QyxFQUFzRCxnQkFBdEQsQ0FEQSxDQURTO0FBQUEsQ0F2RFgsQ0FBQTs7QUFBQSxDQThEQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtTQUFBLFNBQUEsR0FBQTtXQUFHLE9BQUEsQ0FBQSxFQUFIO0VBQUEsRUFBQTtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0E5REEsQ0FBQTs7QUFBQSxDQStEQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsS0FBckIsQ0FBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtTQUFBLFNBQUEsR0FBQTtXQUFHLFFBQUEsQ0FBQSxFQUFIO0VBQUEsRUFBQTtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0EvREEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbiMgQWxsb3dzIHRvIG5hdmlnYXRlIGdpdmVuIHNvdXJjZXMgbGluZXMsIHNhdmluZyBtaWxlc3RvbmVzIHRvIG9wdGltaXplIHJhbmRvbSByZWFkaW5nXG4jIG9wdGlvbnMgPSB7XG4jICAgICAgICBtaWxlc3RvbmVzOiBbXSwgICAgICAgICAvLyBvcHRpb25hbDogYXJyYXkgb2YgbWlsZXN0b25lcywgd2hpY2ggY2FuIGJlIG9idGFpbmVkIGJ5IGdldE1pbGVzdG9uZXMoKSBtZXRob2QgYW5kIHN0b3JlZCB0byBzcGVlZCB1cCByYW5kb20gcmVhZGluZyBpbiBmdXR1cmVcbiMgICAgICAgIGNodW5rU2l6ZTogMTAyNCAqIDQsICAgIC8vIG9wdGlvbmFsOiBzaXplIG9mIGNodW5rIHRvIHJlYWQgYXQgb25jZVxuIyB9XG5cblxuRmlsZU5hdmlnYXRvciA9IChmaWxlLCBvcHRpb25zKSAtPlxuICBzZWxmID0gdGhpc1xuICBzaXplID0gZmlsZS5zaXplXG4gIGZpbGUubmF2aWdhdG9yID0gdGhpc1xuICAjIHJldXNlIG1pbGVzdG9uZXMgbGF0ZXJcbiAgbGFzdFBvc2l0aW9uID0gMFxuXG4gIGdldFByb2dyZXNzID0gLT5cbiAgICBpZiAhc2l6ZSBvciBzaXplID09IDBcbiAgICAgIHJldHVybiAwXG4gICAgcHJvZ3Jlc3MgPSBwYXJzZUludCgxMDAgKiBsYXN0UG9zaXRpb24gLyBzaXplKVxuICAgIGlmIHByb2dyZXNzID4gMTAwIHRoZW4gMTAwIGVsc2UgcHJvZ3Jlc3NcblxuXG5cbiAgIyBjYWxsYmFjayhlcnIsIGJ1ZmZlciwgYnl0ZXNSZWFkKVxuXG4gIHJlYWRDaHVuayA9IChvZmZzZXQsIGxlbmd0aCwgY2FsbGJhY2spIC0+XG4gICAgbGFzdFBvc2l0aW9uID0gb2Zmc2V0ICsgbGVuZ3RoXG4gICAgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXJcblxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAocHJvZ3Jlc3MpIC0+XG4gICAgICBidWZmZXIgPSB1bmRlZmluZWRcbiAgICAgIGlmIHJlYWRlci5yZXN1bHRcbiAgICAgICAgYnVmZmVyID0gbmV3IEludDhBcnJheShyZWFkZXIucmVzdWx0LCAwKVxuICAgICAgICBidWZmZXIuc2xpY2UgPSBidWZmZXIuc3ViYXJyYXlcbiAgICAgIGNhbGxiYWNrIHByb2dyZXNzLmVyciwgYnVmZmVyLCBwcm9ncmVzcy5sb2FkZWRcbiAgICAgIHJldHVyblxuXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyIGZpbGUuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBsZW5ndGgpXG4gICAgcmV0dXJuXG5cblxuXG4gICMgY2FsbGJhY2soc3RyKTtcblxuICBkZWNvZGUgPSAoYnVmZmVyLCBjYWxsYmFjaykgLT5cbiAgICByZWFkZXIgPSBuZXcgRmlsZVJlYWRlclxuXG4gICAgcmVhZGVyLm9ubG9hZGVuZCA9IChwcm9ncmVzcykgLT5cbiAgICAgIGNhbGxiYWNrIHByb2dyZXNzLmN1cnJlbnRUYXJnZXQucmVzdWx0XG4gICAgICByZXR1cm5cblxuICAgIHJlYWRlci5yZWFkQXNUZXh0IG5ldyBCbG9iKFsgYnVmZmVyIF0pXG4gICAgcmV0dXJuXG5cbiAgbmF2aWdhdG9yID0gbmV3IExpbmVOYXZpZ2F0b3IocmVhZENodW5rLCBkZWNvZGUsIG9wdGlvbnMpXG5cblxuXG5cbiAgIyBSZXR1cm5zIGN1cnJlbnQgbWlsZXN0b25lcywgdG8gc3BlZWQgdXAgZmlsZSByYW5kb20gcmVhZGluZyBpbiBmdXR1cmVcblxuICBzZWxmLmdldE1pbGVzdG9uZXMgPSBuYXZpZ2F0b3IuZ2V0TWlsZXN0b25lc1xuXG5cblxuICAjIFJlYWRzIG9wdGltYWwgbnVtYmVyIG9mIGxpbmVzXG4gICMgY2FsbGJhY2s6IGZ1bmN0aW9uKGVyciwgaW5kZXgsIGxpbmVzLCBlb2YsIHByb2dyZXNzKVxuICAjIHdoZXJlIHByb2dyZXNzIGlzIDAtMTAwICUgb2YgZmlsZSBcblxuICBzZWxmLnJlYWRTb21lTGluZXMgPSAoaW5kZXgsIGNhbGxiYWNrKSAtPlxuICAgIG5hdmlnYXRvci5yZWFkU29tZUxpbmVzIGluZGV4LCAoZXJyLCBpbmRleCwgbGluZXMsIGVvZikgLT5cbiAgICAgIGNhbGxiYWNrIGVyciwgaW5kZXgsIGxpbmVzLCBlb2YsIGdldFByb2dyZXNzKClcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG5cblxuICAjIFJlYWRzIGV4YWN0IGFtb3VudCBvZiBsaW5lc1xuICAjIGNhbGxiYWNrOiBmdW5jdGlvbihlcnIsIGluZGV4LCBsaW5lcywgZW9mLCBwcm9ncmVzcylcbiAgIyB3aGVyZSBwcm9ncmVzcyBpcyAwLTEwMCAlIG9mIGZpbGUgXG5cbiAgc2VsZi5yZWFkTGluZXMgPSAoaW5kZXgsIGNvdW50LCBjYWxsYmFjaykgLT5cbiAgICBuYXZpZ2F0b3IucmVhZExpbmVzIGluZGV4LCBjb3VudCwgKGVyciwgaW5kZXgsIGxpbmVzLCBlb2YpIC0+XG4gICAgICBjYWxsYmFjayBlcnIsIGluZGV4LCBsaW5lcywgZW9mLCBnZXRQcm9ncmVzcygpXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuXG5cbiAgIyBGaW5kcyBuZXh0IG9jY3VycmVuY2Ugb2YgcmVndWxhciBleHByZXNzaW9uIHN0YXJ0aW5nIGZyb20gZ2l2ZW4gaW5kZXhcbiAgIyBjYWxsYmFjazogZnVuY3Rpb24oZXJyLCBpbmRleCwgbWF0Y2h7b2Zmc2V0LCBsZW5ndGgsIGxpbmV9KVxuICAjIG9mZnNldCBhbmQgbGVuZ3RoIGFyZSBiZWxvbmcgdG8gbWF0Y2ggaW5zaWRlIGxpbmVcblxuICBzZWxmLmZpbmQgPSBuYXZpZ2F0b3IuZmluZFxuXG5cblxuICAjIEZpbmRzIGFsbCBvY2N1cnJlbmNlcyBvZiByZWd1bGFyIGV4cHJlc3Npb24gc3RhcnRpbmcgZnJvbSBnaXZlbiBpbmRleFxuICAjIGNhbGxiYWNrOiBmdW5jdGlvbihlcnIsIGluZGV4LCBsaW1pdEhpdCwgcmVzdWx0cylcbiAgIyByZXN1bHQgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGZvbGxvd2luZyBzdHJ1Y3R1cmUge2luZGV4LCBvZmZzZXQsIGxlbmd0aCwgbGluZX1cbiAgIyBvZmZzZXQgYW5kIGxlbmd0aCBhcmUgYmVsb25nIHRvIG1hdGNoIGluc2lkZSBsaW5lXG5cbiAgc2VsZi5maW5kQWxsID0gbmF2aWdhdG9yLmZpbmRBbGxcblxuXG4gICMgUmV0dXJucyBzaXplIG9mIGZpbGUgaW4gYnl0ZXNcbiAgIyBjYWxsYmFjazogZnVuY3Rpb24oc2l6ZSlcblxuICBzZWxmLmdldFNpemUgPSAoY2FsbGJhY2spIC0+XG4gICAgY2FsbGJhY2sgaWYgZmlsZSB0aGVuIGZpbGUuc2l6ZSBlbHNlIDBcblxuICByZXR1cm5cblxuXG5tb2R1bGUuZXhwb3J0cz1GaWxlTmF2aWdhdG9yXG4iLCJGaWxlTmF2aWdhdG9yID0gcmVxdWlyZSAnLi9maWxlbmF2aWdhdG9yLmNvZmZlZSdcblxuXG5zaG93X3Byb2dyZXNzID0gKHByb2dyZXNzLG51bWJlcikgLT5cbiAgYmFyPSQoXCIucHJvZ3Jlc3MtYmFyXCIpXG4gIGJhci5jc3MgXCJ3aWR0aFwiLCBcIiN7cHJvZ3Jlc3N9JVwiXG4gIGJhci50ZXh0IFwiI3twcm9ncmVzc30lXCJcbiAgJCgnI2NvdW50ZXInKS50ZXh0IG51bWJlclxuICBjb25zb2xlLmxvZyBcIiN7bnVtYmVyfSA6IGxpbmVzICN7cHJvZ3Jlc3N9XCJcblxuIyBHbG9iYWxzXG51cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6OTIwMC9cIlxuaW5kZXggPSBcImdvdndpa2lcIlxudHlwZSA9IFwiZ292c1wiXG5uYXZpZ2F0b3IgPSB1bmRlZmluZWRcbmZpbGUgPSB1bmRlZmluZWRcbmxpbmVzX2luX2JhdGNoID01MDAwXG5pbmRleFRvU3RhcnRXaXRoID0gMFxub3B0aW9ucyA9IHtjaHVua1NpemU6IDEwMjQgKiAxNn0gIyBjaHVua1NpemU6IDEwMjQgKiAxMDI0ICogNFxuXG5cbmluaXRfdWkgPSAtPlxuICBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nob29zZUZpbGVCdXR0b24nKS5maWxlc1swXVxuICBzaG93X3Byb2dyZXNzIDAsMFxuICBcblxucHJlcGFyZV9qc29uID0oaW5kZXgsIGxpbmVzKSAtPlxuICByZXR1cm4gW1wic29tZVwiLFwianNvblwiXVxuICBcblxuc2VuZF90b19zZXJ2ZXIgPSAoaW5kZXgsIGxpbmVzLCBlb2YsIHByb2dyZXNzLCBqc29uKSAtPlxuICBzZXRUaW1lb3V0ID0+XG4gICAgc2hvd19wcm9ncmVzcyhwcm9ncmVzcywgaW5kZXgrbGluZXMubGVuZ3RoKVxuICAgIGNvbnNvbGUubG9nIFwic2VuZGVkIGpzb246ICN7anNvbn1cIlxuICAgIGlmIGVvZiB0aGVuIHJldHVyblxuICAgICMgUmVhZGluZyBuZXh0IGNodW5rLCBhZGRpbmcgbnVtYmVyIG9mIGxpbmVzIHJlYWQgdG8gZmlyc3QgbGluZSBpbiBjdXJyZW50IGNodW5rXG4gICAgbmF2aWdhdG9yLnJlYWRMaW5lcyBpbmRleCArIGxpbmVzLmxlbmd0aCwgbGluZXNfaW5fYmF0Y2gsICBsaW5lc1JlYWRIYW5kbGVyXG4gICAgI25hdmlnYXRvci5yZWFkU29tZUxpbmVzIGluZGV4ICsgbGluZXMubGVuZ3RoLCAgbGluZXNSZWFkSGFuZGxlclxuICAgIHJldHVyblxuICAsIDEwMDBcblxuXG5cbnByb2Nlc3NfbGluZXMgPSAoaW5kZXgsIGxpbmVzLCBlb2YsIHByb2dyZXNzKSAtPlxuICBqc29uID0gcHJlcGFyZV9qc29uIGluZGV4LCBsaW5lc1xuICBzZW5kX3RvX3NlcnZlciBpbmRleCwgbGluZXMsIGVvZiwgcHJvZ3Jlc3MsIGpzb25cblxuICBcblxubGluZXNSZWFkSGFuZGxlciA9IChlcnIsIGluZGV4LCBsaW5lcywgZW9mLCBwcm9ncmVzcykgLT5cbiAgaWYgZXJyIHRoZW4gIHJldHVyblxuICBwcm9jZXNzX2xpbmVzIGluZGV4LCBsaW5lcywgZW9mLCBwcm9ncmVzc1xuICByZXR1cm5cblxuICBcbnJlYWRGaWxlID0gLT5cbiAgbmF2aWdhdG9yID0gbmV3IEZpbGVOYXZpZ2F0b3IoZmlsZSwgb3B0aW9ucylcbiAgbmF2aWdhdG9yLnJlYWRMaW5lcyBpbmRleFRvU3RhcnRXaXRoLCBsaW5lc19pbl9iYXRjaCwgbGluZXNSZWFkSGFuZGxlclxuICAjbmF2aWdhdG9yLnJlYWRTb21lTGluZXMgaW5kZXhUb1N0YXJ0V2l0aCwgbGluZXNSZWFkSGFuZGxlclxuICByZXR1cm5cblxuXG4kKCcjY2hvb3NlRmlsZUJ1dHRvbicpLmNoYW5nZSA9PiBpbml0X3VpKClcbiQoJyNyZWFkRmlsZUJ1dHRvbicpLmNsaWNrID0+IHJlYWRGaWxlKClcblxuXG4iXX0=
