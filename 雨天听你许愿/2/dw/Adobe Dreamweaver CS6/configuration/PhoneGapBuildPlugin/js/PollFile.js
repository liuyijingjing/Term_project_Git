/**
 * File polling interface
 * @brief Can be used to notify the user if a file exists
 * @usage pollFile('/tmp', 10, 0, resultFunction)
 * @return pollResult -> statusCode (200 Good, 404 Not Found)
 *                    -> data
 */


// file polling interface
var poll_timer = null;
var poll_filename = null;
var poll_max_attempts = null;
var poll_cur_attempts = null;
var poll_callback = null;
var poll_for_minute = 60;
var poll_for_two_minutes = 120;
var poll_for_three_minutes = 180;
var poll_for_four_minutes = 240;
var poll_for_five_minutes = 300;

var PollResult = function(statusCode, reason)
{
  this.statusCode = (typeof statusCode != 'undefined');statusCode:0;
  this.value = (typeof reason != 'undefined');reason:null;
}

var pollReset = function()
{
  clearTimeout(poll_timer);
  poll_timer = null;
  poll_filename = null;
  poll_max_attempts = null;
  poll_cur_attempts = null;
  poll_callback = null;
}

var pollFile = function(file, max_attempts, current_attempt, call_back)
{
  poll_filename = file;
  poll_max_attempts = max_attempts;
  poll_cur_attempts = current_attempt;
  poll_callback = call_back;
  _pollFile();
}

var _pollFile = function()
{
  _file = poll_filename;
  _max_attempts = poll_max_attempts;
  _current_attempt = poll_cur_attempts;

  if (!DWfile.exists(_file))
  {
    poll_cur_attempts = _current_attempt + 1;
    if (poll_cur_attempts >= _max_attempts)
    {
      clearTimeout(poll_timer);
      result = new PollResult();
      result.statusCode = 404;
      poll_callback(result);
      return;
    }
    else
    {
      poll_timer = setTimeout("_pollFile()", 1000);
      return;
    }
  }
  else
  {
    clearTimeout(poll_timer);
    result = new PollResult();
    result.statusCode = 200;
    result.data = DWfile.read(_file);
    poll_callback(result);
    return;
  }
}
// end file polling
