$(document).ready(function() {
    let token = localStorage.getItem('token');
  
    function setAuthHeaders() {
      $.ajaxSetup({
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  
    function showNotes(notes) {
      $('#notes').empty();
      notes.forEach(note => {
        $('#notes').append(`
          <div class="note" style="background-color: ${note.color};">
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <p><strong>Tags:</strong> ${note.tags.join(', ')}</p>
            <p><strong>Reminder:</strong> ${note.reminder ? new Date(note.reminder).toLocaleString() : 'No reminder'}</p>
            <button data-id="${note._id}" class="archive-note">Archive</button>
            <button data-id="${note._id}" class="trash-note">Trash</button>
          </div>
        `);
      });
    }
  
    function getNotes() {
      $.get('/api/notes', function(notes) {
        showNotes(notes);
      });
    }
  
    function getArchivedNotes() {
      $.get('/api/notes/archived', function(notes) {
        showNotes(notes);
      });
    }
  
    function getTrashedNotes() {
      $.get('/api/notes/trash', function(notes) {
        showNotes(notes);
      });
    }
  
    function getLabelNotes(label) {
      $.get(`/api/notes/label/${label}`, function(notes) {
        showNotes(notes);
      });
    }
  
    function getReminderNotes() {
      $.get('/api/notes/reminder', function(notes) {
        showNotes(notes);
      });
    }
  
    $('#login').click(function() {
      const username = $('#username').val();
      const password = $('#password').val();
      $.post('/api/users/login', { username, password }, function(data) {
        token = data.token;
        localStorage.setItem('token', token);
        setAuthHeaders();
        getNotes();
        $('#logout').show();
      });
    });
  
    $('#register').click(function() {
      const username = $('#username').val();
      const password = $('#password').val();
      $.post('/api/users/register', { username, password }, function(data) {
        token = data.token;
        localStorage.setItem('token', token);
        setAuthHeaders();
        getNotes();
        $('#logout').show();
      });
    });
  
    $('#logout').click(function() {
      localStorage.removeItem('token');
      token = null;
      $.ajaxSetup({ headers: {} });
      $('#notes').empty();
      $('#logout').hide();
    });
  
    $('#create-note').click(function() {
      const title = prompt('Enter note title');
      const content = prompt('Enter note content');
      const tags = prompt('Enter tags (comma separated)').split(',');
      const color = prompt('Enter background color', '#ffffff');
      const reminder = prompt('Enter reminder date (YYYY-MM-DD HH:MM:SS)');
  
      $.post('/api/notes', { title, content, tags, color, reminder }, function(note) {
        getNotes();
      });
    });
  
    $('#view-archived').click(function() {
      getArchivedNotes();
    });
  
    $('#view-trash').click(function() {
      getTrashedNotes();
    });
  
    $('#search').keyup(function() {
      const search = $(this).val().toLowerCase();
      $('.note').each(function() {
        const title = $(this).find('h2').text().toLowerCase();
        const content = $(this).find('p').text().toLowerCase();
        if (title.includes(search) || content.includes(search)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  
    $('#labels button').click(function() {
      const label = $(this).data('label');
      getLabelNotes(label);
    });
  
    $('#view-reminder').click(function() {
      getReminderNotes();
    });
  
    $(document).on('click', '.archive-note', function() {
      const id = $(this).data('id');
      $.ajax({
        url: `/api/notes/${id}`,
        type: 'PUT',
        success: function() {
          getNotes();
        }
      });
    });
  
    $(document).on('click', '.trash-note', function() {
      const id = $(this).data('id');
      $.ajax({
        url: `/api/notes/${id}`,
        type: 'DELETE',
        success: function() {
          getNotes();
        }
      });
    });
  
    if (token) {
      setAuthHeaders();
      getNotes();
      $('#logout').show();
    }
  });
  