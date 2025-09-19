import React, { useState } from 'react'
import { useCounterStore, useUserStore, useTodoStore, useSettingsStore } from './stores'
import { StateMonitorDevTools, registerExistingStore } from 'zustand-state-monitor'

// 注册所有stores到监控系统
registerExistingStore('counter', useCounterStore)
registerExistingStore('user', useUserStore) 
registerExistingStore('todos', useTodoStore)
registerExistingStore('settings', useSettingsStore)

function App() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [todoText, setTodoText] = useState('')
  
  // Counter Store
  const { count, increment, decrement, reset, setCount } = useCounterStore()
  
  // User Store
  const { user, isLoading, setUser, logout, setLoading } = useUserStore()
  
  // Todo Store
  const { todos, filter, addTodo, toggleTodo, removeTodo, setFilter, clearCompleted } = useTodoStore()
  
  // Settings Store
  const { theme, notifications, autoSave, language, setTheme, toggleNotifications, toggleAutoSave, setLanguage } = useSettingsStore()

  const handleLogin = () => {
    if (!username.trim() || !email.trim()) return
    
    setLoading(true)
    // 模拟异步登录
    setTimeout(() => {
      setUser({ name: username, email })
      setUsername('')
      setEmail('')
    }, 1000)
  }

  const handleAddTodo = () => {
    if (!todoText.trim()) return
    addTodo(todoText)
    setTodoText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div>
      <h1 className="title">🔍 Zustand State Monitor</h1>
      <p className="subtitle">实时调试开发工具 - 支持热更新</p>
      
      <div className="demo-container">
        {/* Counter Section */}
        <div className="demo-section">
          <h2>📊 计数器状态</h2>
          <div className="counter-display">{count}</div>
          <div className="button-group">
            <button className="btn btn-success" onClick={increment}>
              +1
            </button>
            <button className="btn btn-danger" onClick={decrement}>
              -1
            </button>
            <button className="btn btn-primary" onClick={() => setCount(count + 5)}>
              +5
            </button>
            <button className="btn btn-primary" onClick={() => setCount(count + 10)}>
              +10
            </button>
            <button className="btn btn-secondary" onClick={reset}>
              重置
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="demo-section">
          <h2>👤 用户状态</h2>
          {user ? (
            <div>
              <div className="user-status">
                <strong>{user.name}</strong><br />
                {user.email}<br />
                <small>登录时间: {new Date(user.loginTime).toLocaleString()}</small>
              </div>
              <button className="btn btn-danger" onClick={logout}>
                退出登录
              </button>
            </div>
          ) : (
            <div>
              <div className="input-group">
                <input
                  className="input"
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  className="input"
                  type="email"
                  placeholder="邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </div>
          )}
        </div>

        {/* Todo Section */}
        <div className="demo-section">
          <h2>📝 待办事项</h2>
          <div className="input-group">
            <input
              className="input"
              type="text"
              placeholder="添加新任务..."
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button className="btn btn-primary" onClick={handleAddTodo}>
              添加
            </button>
          </div>
          
          <div className="button-group">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              全部 ({todos.length})
            </button>
            <button 
              className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('active')}
            >
              进行中 ({todos.filter(t => !t.completed).length})
            </button>
            <button 
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('completed')}
            >
              已完成 ({todos.filter(t => t.completed).length})
            </button>
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto', textAlign: 'left', marginTop: '1rem' }}>
            {filteredTodos.map(todo => (
              <div key={todo.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ 
                  flex: 1, 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }}>
                  {todo.text}
                </span>
                <button 
                  className="btn btn-danger" 
                  onClick={() => removeTodo(todo.id)}
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
          
          {todos.filter(t => t.completed).length > 0 && (
            <button className="btn btn-secondary" onClick={clearCompleted} style={{ marginTop: '1rem' }}>
              清除已完成
            </button>
          )}
        </div>

        {/* Settings Section */}
        <div className="demo-section">
          <h2>⚙️ 设置</h2>
          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>主题:</strong>
              </label>
              <div className="button-group">
                <button 
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTheme('light')}
                >
                  浅色
                </button>
                <button 
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTheme('dark')}
                >
                  深色
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={toggleNotifications}
                  style={{ marginRight: '0.5rem' }}
                />
                <strong>启用通知</strong>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={toggleAutoSave}
                  style={{ marginRight: '0.5rem' }}
                />
                <strong>自动保存</strong>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <strong>语言:</strong>
              </label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '6px', 
                  border: '2px solid #e5e7eb',
                  width: '100%'
                }}
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* State Monitor DevTools - 始终显示 */}
      <StateMonitorDevTools defaultVisible={true} />
    </div>
  )
}

export default App