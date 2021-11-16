
function FilePollerResult(poller, statusCode, content)
{
  this.statusCode = statusCode || 0;
  this.val = content || null;
  this.poller = poller;
}

function FilePoller(file, call_back, options)
{
	this.poll_timer = null;
	this.poll_filename = file;
	this.poll_cur_attempts = 0;
	this.poll_callback = call_back;

	options = options || {};
  this.poll_interval = (options.interval === 0) ? 0 : ( options.interval || 1000);
  this.poll_mode = options.mode || 'single';
  this.poll_delay = (options.delay === 0) ? 0 : ( options.delay || this.poll_interval );
  this.poll_max_attempts = (options.max_attempts === 0) ? 0 : (options.max_attempts || ((60000-this.poll_delay) / this.poll_interval));
	
}

FilePoller.prototype.stop = function()
{
  clearTimeout(this.poll_timer);
  this.cancel = true;
  return PollResult(this, 204, "cancelled");
}

FilePoller.prototype.start = function()
{
	var that = this;
  this.poll_timer = setTimeout(function() { that._pollFile(); that = null; }, this.poll_delay);
}

FilePoller.prototype._pollFile = function()
{
	if (this.cancel===true) return;
	
	this.poll_cur_attempts++;
  if (!DWfile.exists(this.poll_filename))
  {
    if (this.poll_max_attempts > 0 && this.poll_cur_attempts >= this.poll_max_attempts)
    {
      clearTimeout(this.poll_timer);
      result = new FilePollerResult(this, 404);
      poll_callback(result);
    }
    else
    {
      var that = this;
      this.poll_timer = setTimeout(function() { that._pollFile(); that = null; }, this.poll_interval);
    }
  }
  else
  {
		if (this.poll_max_attempts == 0 || this.poll_cur_attempts <= this.poll_max_attempts)
    {
      var result = new FilePollerResult(this, 200, DWfile.read(this.poll_filename));
      this.poll_callback(result);
      if (this.poll_mode!=='single') {
	      var that = this;
    	  this.poll_timer = setTimeout(function() { that._pollFile(); that = null; }, this.poll_interval);
      }
    }
  }
}
