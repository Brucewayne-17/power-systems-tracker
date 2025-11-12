import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Circle, Plus, Trash2, Edit2, Save, Download, Upload } from 'lucide-react';

const PowerSystemsTracker = () => {
  const STORAGE_KEY = 'power-systems-chapters';
  
  const defaultChapters = [
    { id: 1, number: 1, title: "Introduction", pages: "1-30", completed: false, notes: "", editing: false },
    { id: 2, number: 2, title: "Fundamentals", pages: "31-80", completed: false, notes: "", editing: false },
    { id: 3, number: 3, title: "Power Transformers", pages: "81-140", completed: false, notes: "", editing: false },
    { id: 4, number: 4, title: "Transmission Line Parameters", pages: "141-200", completed: false, notes: "", editing: false },
    { id: 5, number: 5, title: "Transmission Lines: Steady-State Operation", pages: "201-260", completed: false, notes: "", editing: false },
    { id: 6, number: 6, title: "Power Flows", pages: "261-320", completed: false, notes: "", editing: false },
    { id: 7, number: 7, title: "Symmetrical Faults", pages: "321-380", completed: false, notes: "", editing: false },
    { id: 8, number: 8, title: "Symmetrical Components", pages: "381-440", completed: false, notes: "", editing: false },
    { id: 9, number: 9, title: "Unsymmetrical Faults", pages: "441-500", completed: false, notes: "", editing: false },
    { id: 10, number: 10, title: "System Protection", pages: "501-560", completed: false, notes: "", editing: false },
    { id: 11, number: 11, title: "Transient Stability", pages: "561-620", completed: false, notes: "", editing: false },
    { id: 12, number: 12, title: "Power System Controls", pages: "621-680", completed: false, notes: "", editing: false },
  ];

  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({ number: '', title: '', pages: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever chapters change
  useEffect(() => {
    if (!isLoading && chapters.length > 0) {
      saveData();
    }
  }, [chapters, isLoading]);

  const loadData = async () => {
    try {
      const result = await window.storage.get(STORAGE_KEY);
      if (result && result.value) {
        const savedChapters = JSON.parse(result.value);
        setChapters(savedChapters);
        setSaveStatus('Data loaded successfully!');
      } else {
        setChapters(defaultChapters);
        setSaveStatus('Using default chapters');
      }
    } catch (error) {
      console.log('No saved data found, using defaults');
      setChapters(defaultChapters);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const saveData = async () => {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(chapters));
      setSaveStatus('✓ Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('⚠ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const toggleComplete = (id) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, completed: !ch.completed } : ch
    ));
  };

  const deleteChapter = (id) => {
    setChapters(chapters.filter(ch => ch.id !== id));
  };

  const addChapter = () => {
    if (newChapter.title) {
      const newId = Math.max(...chapters.map(ch => ch.id), 0) + 1;
      setChapters([...chapters, {
        id: newId,
        number: newChapter.number || chapters.length + 1,
        title: newChapter.title,
        pages: newChapter.pages,
        completed: false,
        notes: "",
        editing: false
      }]);
      setNewChapter({ number: '', title: '', pages: '' });
      setShowAddForm(false);
    }
  };

  const toggleEdit = (id) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, editing: !ch.editing } : ch
    ));
  };

  const updateNotes = (id, notes) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, notes } : ch
    ));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(chapters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'power-systems-reading-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    setSaveStatus('✓ Exported');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setChapters(imported);
          setSaveStatus('✓ Imported successfully');
          setTimeout(() => setSaveStatus(''), 2000);
        } catch (error) {
          setSaveStatus('⚠ Import failed');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setChapters(defaultChapters);
      setSaveStatus('✓ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your reading progress...</p>
        </div>
      </div>
    );
  }

  const completedCount = chapters.filter(ch => ch.completed).length;
  const progressPercent = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            <BookOpen className="w-12 h-12 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Power System Analysis & Design
              </h1>
              <p className="text-gray-600 mb-1">Sixth Edition</p>
              <p className="text-sm text-gray-500">
                J. Duncan Glover, Thomas J. Overbye, and Mulukutla S. Sarma
              </p>
            </div>
            {saveStatus && (
              <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded">
                {saveStatus}
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{completedCount}/{chapters.length} chapters ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export Backup
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Backup
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(chapter.id)}
                    className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    {chapter.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${chapter.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          Chapter {chapter.number}: {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Pages: {chapter.pages}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleEdit(chapter.id)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Edit notes"
                        >
                          {chapter.editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => deleteChapter(chapter.id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Notes Section */}
                    <div className="mt-3">
                      {chapter.editing ? (
                        <textarea
                          value={chapter.notes}
                          onChange={(e) => updateNotes(chapter.id, e.target.value)}
                          placeholder="Add your notes, key concepts, or questions..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows="4"
                        />
                      ) : chapter.notes ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{chapter.notes}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No notes yet. Click the edit icon to add notes.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Chapter Button */}
        <div className="mt-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Custom Chapter
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Chapter</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Chapter number"
                  value={newChapter.number}
                  onChange={(e) => setNewChapter({ ...newChapter, number: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Chapter title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Page range (e.g., 101-150)"
                  value={newChapter.pages}
                  onChange={(e) => setNewChapter({ ...newChapter, pages: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addChapter}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Add Chapter
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewChapter({ number: '', title: '', pages: '' });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerSystemsTracker;