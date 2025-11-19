// import React, { useState, useEffect } from 'react';
// import { Book, ShoppingCart, Search, Plus, Edit2, Trash2, LayoutGrid, Settings, ArrowLeft, Save, X, LogIn, LogOut, Lock, Heart, CheckCircle, Package, User as UserIcon } from 'lucide-react';
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// // --- 1. FIREBASE CONFIGURATION ---
// const firebaseConfig = {
//   apiKey: "AIzaSyDZOnDXbtw5Ke4JV4_kpK5KLa3Equ_BSh4",
//   authDomain: "book-store-77883.firebaseapp.com",
//   projectId: "book-store-77883",
//   storageBucket: "book-store-77883.firebasestorage.app",
//   messagingSenderId: "494552908812",
//   appId: "1:494552908812:web:cf7e4450acdf59ba271a29",
//   measurementId: "G-4MD69XH25D"
// };

// // Need to change when deploy with k8s
// // const API_URL = '/api';
// const API_URL = 'http://localhost:3001/api';
// const ADMIN_CREDS = { username: 'admin', password: 'password' };

// // Initialize Firebase safely
// let auth = null;
// let googleProvider = null;
// try {
//   const app = initializeApp(firebaseConfig);
//   auth = getAuth(app);
//   googleProvider = new GoogleAuthProvider();
// } catch (e) {
//   console.warn("Firebase Init Error:", e);
// }

// // --- COMPONENTS ---

// const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, ...props }) => {
//   const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
//     secondary: "bg-white text-blue-900 border border-blue-100 hover:border-blue-300 hover:bg-blue-50",
//     danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
//     ghost: "text-slate-500 hover:text-blue-600 hover:bg-slate-100",
//     outline: "border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600",
//   };
//   return (
//     <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
//       {Icon && <Icon size={18} />}
//       {children}
//     </button>
//   );
// };

// const Input = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1 mb-4">
//     {label && <label className="text-sm font-medium text-slate-600 mb-1 block">{label}</label>}
//     <input className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...props} />
//   </div>
// );

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
// );

// const Badge = ({ children, color = 'blue' }) => {
//   const colors = {
//     blue: 'bg-blue-50 text-blue-700',
//     red: 'bg-red-50 text-red-700',
//     green: 'bg-green-50 text-green-700',
//     yellow: 'bg-yellow-50 text-yellow-700'
//   };
//   return <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${colors[color] || colors.blue}`}>{children}</span>;
// };

// // --- MAIN APPLICATION ---

// export default function BookstoreApp() {
//   const [view, setView] = useState('catalog'); 
//   const [books, setBooks] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedBook, setSelectedBook] = useState(null);
  
//   // Shopping State
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [checkoutDetails, setCheckoutDetails] = useState({ name: '', address: '', phone: '' });
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   // Auth State
//   const [googleUser, setGoogleUser] = useState(null);
//   const [adminUser, setAdminUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   // Admin Logic State
//   const [showAdminLogin, setShowAdminLogin] = useState(false);
//   const [adminLoginData, setAdminLoginData] = useState({ username: '', password: '' });
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ title: '', author: '', price: '', category: '', description: '', quantity: '' });
//   const [adminTab, setAdminTab] = useState('inventory');

//   // --- DATA FETCHING ---
//   const fetchData = () => {
//     fetch(`${API_URL}/books`)
//       .then(r => r.json())
//       .then(setBooks)
//       .catch(err => console.error("Failed to load books:", err));

//     fetch(`${API_URL}/orders`)
//       .then(r => r.json())
//       .then(setOrders)
//       .catch(err => console.error("Failed to load orders:", err));
//   };

//   useEffect(() => { fetchData(); }, []);

//   useEffect(() => {
//     if (auth) {
//         return onAuthStateChanged(auth, (user) => {
//             setGoogleUser(user);
//             if (user) {
//                 setAdminUser(null);
//                 setCheckoutDetails(p => ({ ...p, name: user.displayName || '' }));
//                 setView('catalog');
//             }
//             setAuthLoading(false);
//         });
//     } else { setAuthLoading(false); }
//   }, []);

//   // --- SHOPPING LOGIC ---
//   const addToCart = (book) => {
//     if (book.quantity <= 0) return alert("Item is out of stock!");
    
//     setCart(prev => {
//       const existing = prev.find(item => item.id === book.id);
//       if (existing) {
//           if (existing.quantity >= book.quantity) {
//               alert(`Sorry, only ${book.quantity} items available.`);
//               return prev;
//           }
//           return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       return [...prev, { ...book, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id, delta) => {
//     setCart(prev => prev.map(item => {
//         if (item.id === id) {
//              const book = books.find(b => b.id === id);
//              const newQty = Math.max(1, item.quantity + delta);
//              if (book && newQty > book.quantity) {
//                  alert(`Only ${book.quantity} items available.`);
//                  return item;
//              }
//              return { ...item, quantity: newQty };
//         }
//         return item;
//     }));
//   };

//   const removeFromCart = (id) => setCart(p => p.filter(i => i.id !== id));
//   const toggleWishlist = (book) => setWishlist(p => p.find(i => i.id === book.id) ? p.filter(i => i.id !== book.id) : [...p, book]);
//   const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     const newOrder = {
//         items: cart,
//         total: cartTotal,
//         shipping: checkoutDetails,
//         userId: googleUser ? googleUser.uid : 'guest'
//     };

//     try {
//         const res = await fetch(`${API_URL}/orders`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(newOrder)
//         });
        
//         if (res.ok) {
//             fetchData(); // Refresh books (quantities deducted) and orders list
//             setCart([]); 
//             setOrderSuccess(true);
//             setTimeout(() => { setOrderSuccess(false); setView('orders'); }, 2000);
//         } else {
//             const errorData = await res.json();
//             alert(errorData.message || "Order failed. Check stock.");
//         }
//     } catch (err) {
//         alert("Order failed. Backend unavailable.");
//     }
//   };

//   // --- ADMIN/AUTH HANDLERS ---
//   const handleGoogleLogin = async () => { if(auth) { setAdminUser(null); await signInWithPopup(auth, googleProvider); }};
//   const handleGoogleLogout = async () => { await signOut(auth); setView('catalog'); };
  
//   const handleAdminLogin = (e) => {
//     e.preventDefault();
//     if (adminLoginData.username === ADMIN_CREDS.username && adminLoginData.password === ADMIN_CREDS.password) {
//         if(auth?.currentUser) signOut(auth);
//         setAdminUser({ name: "Admin", role: "admin" });
//         setShowAdminLogin(false);
//         setAdminLoginData({username:'', password:''});
//         setView('admin');
//     } else alert("Invalid credentials");
//   };

//   const handleSaveBook = async (e) => {
//     e.preventDefault();
//     const endpoint = isEditing ? `${API_URL}/books/${selectedBook.id}` : `${API_URL}/books`;
//     const method = isEditing ? 'PUT' : 'POST';
//     const payload = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity), cover: selectedBook?.cover || 'blue' };

//     const res = await fetch(endpoint, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
//     if(res.ok) { fetchData(); setIsEditing(false); navigate('admin'); }
//   };

//   const handleDeleteBook = async (id) => {
//       if(confirm('Delete?')) { await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' }); fetchData(); }
//   };

//   const navigate = (target, book = null) => {
//     if (target === 'admin' && !adminUser) { setShowAdminLogin(true); return; }
//     setView(target);
//     if (book) setSelectedBook(book);
//     if (target === 'admin') { setIsEditing(false); setAdminTab('inventory'); if(!book) setFormData({ title: '', author: '', price: '', category: '', description: '', quantity: '' }); }
//   };

//   const prepareEdit = (book) => { setSelectedBook(book); setFormData({ ...book }); setIsEditing(true); };
//   const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

//   // --- RENDER FUNCTIONS ---
  
//   const renderNavbar = () => (
//     <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//         <div className="flex items-center cursor-pointer" onClick={() => navigate('catalog')}>
//             <div className="bg-blue-600 p-2 rounded-lg mr-3"><Book className="text-white" size={24} /></div>
//             <div><h1 className="text-xl font-bold text-slate-900">CloudRead</h1><p className="text-xs text-slate-500">Microservices Demo</p></div>
//         </div>
//         <div className="flex items-center gap-3">
//             <Button variant={view === 'catalog' ? 'ghost' : 'secondary'} onClick={() => navigate('catalog')} icon={LayoutGrid}>Store</Button>
//             {!adminUser && (
//                <>
//                 <Button variant={view === 'wishlist' ? 'ghost' : 'secondary'} onClick={() => navigate('wishlist')}><Heart size={18} className={view === 'wishlist' ? "fill-blue-600 text-blue-600" : ""} /></Button>
//                 {googleUser && <Button variant={view === 'orders' ? 'ghost' : 'secondary'} onClick={() => navigate('orders')} title="My Orders"><Package size={18}/></Button>}
//                 <Button variant={view === 'cart' ? 'ghost' : 'secondary'} onClick={() => navigate('cart')} className="relative">
//                    <ShoppingCart size={18}/> {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
//                 </Button>
//                </>
//             )}
//             {!googleUser && <Button variant={view === 'admin' || adminUser ? 'ghost' : 'secondary'} onClick={() => navigate('admin')} icon={Settings} className={adminUser ? "text-blue-600 bg-blue-50" : ""}>{adminUser ? "Admin" : "Login"}</Button>}
            
//             <div className="h-8 w-px bg-slate-200 mx-1"></div>
//             {authLoading ? <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-lg"></div> : googleUser ? (
//                <div className="flex items-center gap-3 pl-2">
//                  <div className="text-right hidden md:block"><span className="text-xs font-bold block">{googleUser.displayName}</span><span className="text-xs text-slate-500">Shopper</span></div>
//                  <img src={googleUser.photoURL} alt="U" className="w-9 h-9 rounded-full border"/>
//                  <Button variant="ghost" onClick={handleGoogleLogout} className="!px-2"><LogOut size={18}/></Button>
//                </div>
//             ) : adminUser ? (
//                <div className="flex items-center gap-3 pl-2 bg-slate-100 px-3 py-1 rounded-full">
//                   <div className="text-right"><span className="text-xs font-bold block">Administrator</span><span className="text-[10px] text-blue-600">Active</span></div>
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><Lock size={14}/></div>
//                   <Button variant="ghost" onClick={() => { setAdminUser(null); setView('catalog'); }} className="!px-1 ml-1"><LogOut size={16}/></Button>
//                </div>
//             ) : <Button variant="primary" onClick={handleGoogleLogin} icon={LogIn}>Sign In</Button>}
//         </div>
//       </div>
//     </nav>
//   );

//   const renderCatalogView = () => (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="mb-10 text-center"><h2 className="text-3xl font-bold mb-4">Catalog</h2><input type="text" placeholder="Search..." className="p-2 border rounded w-full max-w-md" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
//         {filteredBooks.map((book) => (
//           <Card key={book.id} className="group hover:shadow-md cursor-pointer overflow-hidden flex flex-col h-full relative">
//             {!adminUser && <button onClick={(e) => { e.stopPropagation(); toggleWishlist(book); }} className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm"><Heart size={16} className={wishlist.find(i=>i.id===book.id) ? "fill-red-500 text-red-500" : "text-slate-400"}/></button>}
//             <div onClick={() => navigate('details', book)} className="h-48 bg-slate-50 flex items-center justify-center relative">
//                 <Book size={48} className={`text-${book.cover}-400`}/>
//                 {book.quantity === 0 && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">Out of Stock</span></div>}
//             </div>
//             <div className="p-4 flex-1 flex flex-col">
//               <h3 className="font-bold mb-1">{book.title}</h3>
//               <p className="text-sm text-slate-500 mb-2">{book.author}</p>
//               <div className="mt-auto flex justify-between items-center">
//                 <div className="flex flex-col">
//                     <span className="font-bold text-blue-600">${book.price}</span>
//                     <span className="text-[10px] text-slate-400">{book.quantity} in stock</span>
//                 </div>
//                 {!adminUser && book.quantity > 0 && <button onClick={(e) => { e.stopPropagation(); addToCart(book); }} className="p-2 bg-blue-50 rounded-full text-blue-600"><ShoppingCart size={18}/></button>}
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );

//   const renderAdminView = () => {
//     if (!adminUser) return <div className="p-10 text-center">Access Denied.</div>;

//     if (isEditing) {
//       return (
//         <div className="max-w-2xl mx-auto px-4 py-10">
//             <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">{selectedBook ? 'Edit Book' : 'Add New Book'}</h2><Button variant="ghost" onClick={() => setIsEditing(false)} icon={X}>Cancel</Button></div>
//             <Card className="p-6">
//                 <form onSubmit={handleSaveBook}>
//                     <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
//                     <Input label="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
//                     <div className="grid grid-cols-2 gap-4">
//                         <Input label="Price ($)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
//                         <Input label="Stock Quantity" type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
//                     </div>
//                     <Input label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
//                     <div className="mb-6"><label className="text-sm font-medium block mb-1">Description</label><textarea className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/></div>
//                     <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button><Button icon={Save}>Save Changes</Button></div>
//                 </form>
//             </Card>
//         </div>
//       );
//     }

//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//             <div><h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2><p className="text-slate-500">Manage inventory and track customer orders.</p></div>
//             <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
//                 <button onClick={() => setAdminTab('inventory')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${adminTab === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Inventory</button>
//                 <button onClick={() => setAdminTab('orders')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${adminTab === 'orders' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Customer Orders</button>
//             </div>
//         </div>

//         {adminTab === 'inventory' ? (
//             <>
//                 <div className="flex justify-end mb-4"><Button onClick={() => { setSelectedBook(null); setFormData({ title: '', author: '', price: '', category: '', description: '', quantity: '' }); setIsEditing(true); }} icon={Plus}>Add New Book</Button></div>
//                 <Card className="overflow-hidden">
//                     <table className="w-full text-left">
//                         <thead><tr className="bg-slate-50 border-b"><th className="p-4">Book</th><th className="p-4">Stock</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead>
//                         <tbody>
//                             {books.map(book => (
//                                 <tr key={book.id} className="border-b hover:bg-slate-50/50">
//                                     <td className="p-4 font-medium">{book.title}</td>
//                                     <td className="p-4"><Badge color={book.quantity === 0 ? 'red' : book.quantity < 5 ? 'yellow' : 'green'}>{book.quantity} units</Badge></td>
//                                     <td className="p-4">${book.price}</td>
//                                     <td className="p-4 text-right"><button onClick={() => prepareEdit(book)} className="mr-3 text-blue-600"><Edit2 size={18}/></button><button onClick={() => handleDeleteBook(book.id)} className="text-red-600"><Trash2 size={18}/></button></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </Card>
//             </>
//         ) : (
//             <Card>
//                  <div className="p-4 bg-slate-50 border-b"><h3 className="font-bold">All Customer Orders</h3></div>
//                  {orders.length === 0 ? <div className="p-8 text-center text-slate-500">No orders found.</div> : (
//                      <div className="divide-y">
//                         {orders.map(order => (
//                             <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
//                                 <div className="flex justify-between mb-4">
//                                     <div><span className="font-bold text-lg">{order.id}</span><span className="text-slate-500 text-sm ml-2">{order.date}</span><span className="text-xs ml-2 bg-slate-200 px-2 py-0.5 rounded text-slate-600">User: {order.userId}</span></div>
//                                     <Badge color="green">{order.status}</Badge>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="bg-white p-3 rounded border">
//                                         <p className="text-xs font-bold text-slate-400 uppercase mb-2">Items Ordered</p>
//                                         {order.items.map((item, idx) => (
//                                             <div key={idx} className="flex justify-between text-sm mb-1"><span>{item.title} <span className="text-slate-400">x{item.quantity}</span></span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
//                                         ))}
//                                         <div className="border-t mt-2 pt-2 flex justify-between font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
//                                     </div>
//                                     <div className="bg-white p-3 rounded border">
//                                         <p className="text-xs font-bold text-slate-400 uppercase mb-2">Shipping Details</p>
//                                         <p className="text-sm font-bold">{order.shipping.name}</p>
//                                         <p className="text-sm text-slate-600">{order.shipping.address}</p>
//                                         <p className="text-sm text-slate-600">{order.shipping.phone}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                      </div>
//                  )}
//             </Card>
//         )}
//       </div>
//     );
//   };

//   const renderCartView = () => (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
//       {cart.length === 0 ? <div className="text-center py-20">Empty Cart</div> : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-4">
//                 {cart.map(item => (
//                     <Card key={item.id} className="p-4 flex gap-4 items-center">
//                         <div className={`w-20 h-24 bg-${item.cover}-100 rounded flex items-center justify-center text-${item.cover}-400 shrink-0`}><Book size={32}/></div>
//                         <div className="flex-1"><h3 className="font-bold">{item.title}</h3><p className="text-sm text-slate-500">${item.price}</p></div>
//                         <div className="flex items-center gap-3"><button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-slate-100 rounded">-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-slate-100 rounded">+</button></div>
//                         <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4"><Trash2 size={18}/></button>
//                     </Card>
//                 ))}
//             </div>
//             <div className="lg:col-span-1"><Card className="p-6 sticky top-24"><h3 className="font-bold mb-4">Total: ${cartTotal.toFixed(2)}</h3><Button onClick={() => setView('checkout')} className="w-full py-3">Checkout</Button></Card></div>
//         </div>
//       )}
//     </div>
//   );

//   const renderCheckoutView = () => {
//     if (orderSuccess) return <div className="text-center py-20"><CheckCircle size={64} className="mx-auto text-green-500 mb-4"/><h2 className="text-2xl font-bold">Order Placed!</h2><Button onClick={() => setView('catalog')} className="mt-6">Back to Store</Button></div>;
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-10">
//          <Button variant="ghost" onClick={() => setView('cart')} className="mb-6 pl-0"><ArrowLeft size={20}/> Back</Button>
//          <h2 className="text-3xl font-bold mb-8">Checkout</h2>
//          <Card className="p-6">
//              <h3 className="font-bold mb-4">Shipping Info</h3>
//              <form onSubmit={handlePlaceOrder}>
//                  <Input label="Name" value={checkoutDetails.name} onChange={e => setCheckoutDetails({...checkoutDetails, name: e.target.value})} required />
//                  <Input label="Address" value={checkoutDetails.address} onChange={e => setCheckoutDetails({...checkoutDetails, address: e.target.value})} required />
//                  <Input label="Phone" value={checkoutDetails.phone} onChange={e => setCheckoutDetails({...checkoutDetails, phone: e.target.value})} required />
//                  <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded font-bold text-center">Total: ${cartTotal.toFixed(2)} (Cash on Delivery)</div>
//                  <Button className="w-full mt-6 py-3" icon={CheckCircle}>Confirm Order</Button>
//              </form>
//          </Card>
//       </div>
//     );
//   };

//   const renderOrdersView = () => (
//       <div className="max-w-5xl mx-auto px-4 py-10">
//           <h2 className="text-3xl font-bold mb-8">My Order History</h2>
//           {orders.filter(o => o.userId === (googleUser?.uid || 'guest')).length === 0 ? <div className="text-center py-20">No orders found.</div> : (
//               <div className="space-y-4">
//                   {orders.filter(o => o.userId === (googleUser?.uid || 'guest')).map(order => (
//                       <Card key={order.id} className="p-6">
//                           <div className="flex justify-between border-b pb-4 mb-4"><div><span className="font-bold">{order.id}</span><br/><span className="text-sm text-slate-500">{order.date}</span></div><span className="font-bold text-green-600">{order.status}</span></div>
//                           {order.items.map(i => <div key={i.id} className="flex justify-between text-sm mb-1"><span>{i.title} x {i.quantity}</span><span>${i.price}</span></div>)}
//                           <div className="border-t pt-4 mt-4 font-bold text-right">Total: ${order.total.toFixed(2)}</div>
//                       </Card>
//                   ))}
//               </div>
//           )}
//       </div>
//   );

//   const renderWishlistView = () => (
//       <div className="max-w-5xl mx-auto px-4 py-10">
//           <h2 className="text-3xl font-bold mb-8">Wishlist</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             {wishlist.map(book => (
//                 <Card key={book.id} className="p-4 relative"><button onClick={() => toggleWishlist(book)} className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500"><X size={16}/></button><div className={`h-32 bg-${book.cover}-50 rounded mb-2 flex items-center justify-center`}><Book size={32} className={`text-${book.cover}-400`}/></div><h3 className="font-bold truncate">{book.title}</h3><Button onClick={() => addToCart(book)} size="sm" className="w-full mt-2">Add to Cart</Button></Card>
//             ))}
//           </div>
//       </div>
//   );

//   const renderDetailsView = () => (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <Button variant="ghost" onClick={() => navigate('catalog')} className="mb-6 pl-0"><ArrowLeft size={20}/> Back</Button>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className={`aspect-[3/4] bg-${selectedBook.cover}-50 rounded-xl flex items-center justify-center`}><Book size={100} className={`text-${selectedBook.cover}-400`}/></div>
//         <div className="md:col-span-2">
//             <h1 className="text-4xl font-bold mb-2">{selectedBook.title}</h1>
//             <div className="flex gap-4 mb-6">
//                 <Badge>{selectedBook.category}</Badge>
//                 <Badge color={selectedBook.quantity > 0 ? 'green' : 'red'}>{selectedBook.quantity > 0 ? 'In Stock' : 'Out of Stock'}</Badge>
//             </div>
//             <div className="text-3xl font-bold text-blue-600 mb-6">${selectedBook.price}</div>
//             <p className="text-slate-600 mb-8">{selectedBook.description}</p>
//             {!adminUser && selectedBook.quantity > 0 && <Button onClick={() => addToCart(selectedBook)} className="px-8 py-3 text-lg">Add to Cart</Button>}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
//       {renderNavbar()}
//       {showAdminLogin && (
//          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
//             <Card className="w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
//                 <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
//                 <div className="text-center mb-8"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div><h2 className="text-2xl font-bold text-slate-900">Admin Access</h2></div>
//                 <form onSubmit={handleAdminLogin}><Input label="Username" value={adminLoginData.username} onChange={e => setAdminLoginData({...adminLoginData, username: e.target.value})} autoFocus /><Input label="Password" type="password" value={adminLoginData.password} onChange={e => setAdminLoginData({...adminLoginData, password: e.target.value})} /><Button className="w-full mt-6 py-3" icon={LogIn}>Access Dashboard</Button></form>
//                 <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 p-2 rounded">Demo: <strong>admin</strong> / <strong>password</strong></div>
//             </Card>
//          </div>
//       )}
//       <main>
//         {view === 'catalog' && renderCatalogView()}
//         {view === 'details' && selectedBook && renderDetailsView()}
//         {view === 'cart' && renderCartView()}
//         {view === 'wishlist' && renderWishlistView()}
//         {view === 'orders' && renderOrdersView()}
//         {view === 'checkout' && renderCheckoutView()}
//         {view === 'admin' && renderAdminView()}
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Book, ShoppingCart, Search, Plus, Edit2, Trash2, LayoutGrid, Settings, ArrowLeft, Save, X, LogIn, LogOut, Lock, Heart, CheckCircle, Package, User as UserIcon, Star } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDZOnDXbtw5Ke4JV4_kpK5KLa3Equ_BSh4",
  authDomain: "book-store-77883.firebaseapp.com",
  projectId: "book-store-77883",
  storageBucket: "book-store-77883.firebasestorage.app",
  messagingSenderId: "494552908812",
  appId: "1:494552908812:web:cf7e4450acdf59ba271a29",
  measurementId: "G-4MD69XH25D"
};

// Use relative path so Vite Proxy (Local) or Ingress (K8s) can route traffic
const API_URL = '/api'; 
// const API_URL = 'http://localhost:3001/api'; 
const ADMIN_CREDS = { username: 'admin', password: 'password' };

// Initialize Firebase safely
let auth = null;
let googleProvider = null;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase Init Error:", e);
}

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    secondary: "bg-white text-blue-900 border border-blue-100 hover:border-blue-300 hover:bg-blue-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-slate-500 hover:text-blue-600 hover:bg-slate-100",
    outline: "border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    {label && <label className="text-sm font-medium text-slate-600 mb-1 block">{label}</label>}
    <input className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...props} />
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700'
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${colors[color] || colors.blue}`}>{children}</span>;
};

// --- MAIN APPLICATION ---

export default function BookstoreApp() {
  // --- STATE ---
  const [view, setView] = useState('catalog'); 
  const [books, setBooks] = useState([]);
  const [recommendation, setRecommendation] = useState(null); // Python Service Data
  const [orders, setOrders] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Shopping State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState({ name: '', address: '', phone: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Auth State
  const [googleUser, setGoogleUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Admin Logic State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoginData, setAdminLoginData] = useState({ username: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', category: '', description: '', quantity: '' });
  const [adminTab, setAdminTab] = useState('inventory');

  // --- DATA FETCHING ---
  const fetchData = () => {
    // 1. Node.js Backend (Books)
    fetch(`${API_URL}/books`)
      .then(r => r.json())
      .then(setBooks)
      .catch(err => console.error("Failed to load books:", err));

    // 2. Node.js Backend (Orders)
    fetch(`${API_URL}/orders`)
      .then(r => r.json())
      .then(setOrders)
      .catch(err => console.error("Failed to load orders:", err));

    // 3. Python Backend (Recommendations)
    fetch(`${API_URL}/recommendations`)
      .then(r => r.json())
      .then(data => setRecommendation(data))
      .catch(err => console.warn("Recommendation Service Offline:", err));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (auth) {
        return onAuthStateChanged(auth, (user) => {
            setGoogleUser(user);
            if (user) {
                setAdminUser(null);
                setCheckoutDetails(p => ({ ...p, name: user.displayName || '' }));
                setView('catalog');
            }
            setAuthLoading(false);
        });
    } else { setAuthLoading(false); }
  }, []);

  // --- SHOPPING LOGIC ---
  const addToCart = (book) => {
    if (book.quantity !== undefined && book.quantity <= 0) return alert("Item is out of stock!");
    
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
          if (book.quantity !== undefined && existing.quantity >= book.quantity) {
              alert(`Sorry, only ${book.quantity} items available.`);
              return prev;
          }
          return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
             let book = books.find(b => b.id === id);
             if (!book && recommendation && recommendation.id === id) book = recommendation;
             const newQty = Math.max(1, item.quantity + delta);
             if (book && book.quantity !== undefined && newQty > book.quantity) {
                 alert(`Only ${book.quantity} items available.`);
                 return item;
             }
             return { ...item, quantity: newQty };
        }
        return item;
    }));
  };

  const removeFromCart = (id) => setCart(p => p.filter(i => i.id !== id));
  const toggleWishlist = (book) => setWishlist(p => p.find(i => i.id === book.id) ? p.filter(i => i.id !== book.id) : [...p, book]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const newOrder = { items: cart, total: cartTotal, shipping: checkoutDetails, userId: googleUser ? googleUser.uid : 'guest' };
    try {
        const res = await fetch(`${API_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newOrder) });
        if (res.ok) { fetchData(); setCart([]); setOrderSuccess(true); setTimeout(() => { setOrderSuccess(false); setView('orders'); }, 2000); } 
        else { const errorData = await res.json(); alert(errorData.message || "Order failed."); }
    } catch (err) { alert("Order failed. Backend unavailable."); }
  };

  // --- ADMIN/AUTH HANDLERS ---
  const handleGoogleLogin = async () => { if(auth) { setAdminUser(null); await signInWithPopup(auth, googleProvider); }};
  const handleGoogleLogout = async () => { await signOut(auth); setView('catalog'); };
  
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminLoginData.username === ADMIN_CREDS.username && adminLoginData.password === ADMIN_CREDS.password) {
        if(auth?.currentUser) signOut(auth);
        setAdminUser({ name: "Admin", role: "admin" });
        setShowAdminLogin(false);
        setAdminLoginData({username:'', password:''});
        setView('admin');
    } else alert("Invalid credentials");
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? `${API_URL}/books/${selectedBook.id}` : `${API_URL}/books`;
    const method = isEditing ? 'PUT' : 'POST';
    const payload = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity), cover: selectedBook?.cover || 'blue' };
    const res = await fetch(endpoint, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(res.ok) { fetchData(); setIsEditing(false); navigate('admin'); }
  };

  const handleDeleteBook = async (id) => { if(confirm('Delete?')) { await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' }); fetchData(); } };

  const navigate = (target, book = null) => {
    if (target === 'admin' && !adminUser) { setShowAdminLogin(true); return; }
    setView(target);
    if (book) setSelectedBook(book);
    if (target === 'admin') { setIsEditing(false); setAdminTab('inventory'); if(!book) setFormData({ title: '', author: '', price: '', category: '', description: '', quantity: '' }); }
  };

  const prepareEdit = (book) => { setSelectedBook(book); setFormData({ ...book }); setIsEditing(true); };
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- RENDER FUNCTIONS ---
  
  const renderNavbar = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('catalog')}>
            <div className="bg-blue-600 p-2 rounded-lg mr-3"><Book className="text-white" size={24} /></div>
            <div><h1 className="text-xl font-bold text-slate-900">CloudRead</h1><p className="text-xs text-slate-500">Microservices Demo</p></div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant={view === 'catalog' ? 'ghost' : 'secondary'} onClick={() => navigate('catalog')} icon={LayoutGrid}>Store</Button>
            {!adminUser && (
               <>
                <Button variant={view === 'wishlist' ? 'ghost' : 'secondary'} onClick={() => navigate('wishlist')}><Heart size={18} className={view === 'wishlist' ? "fill-blue-600 text-blue-600" : ""} /></Button>
                {googleUser && <Button variant={view === 'orders' ? 'ghost' : 'secondary'} onClick={() => navigate('orders')} title="My Orders"><Package size={18}/></Button>}
                <Button variant={view === 'cart' ? 'ghost' : 'secondary'} onClick={() => navigate('cart')} className="relative">
                   <ShoppingCart size={18}/> {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                </Button>
               </>
            )}
            {!googleUser && <Button variant={view === 'admin' || adminUser ? 'ghost' : 'secondary'} onClick={() => navigate('admin')} icon={Settings} className={adminUser ? "text-blue-600 bg-blue-50" : ""}>{adminUser ? "Admin" : "Login"}</Button>}
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            {authLoading ? <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-lg"></div> : googleUser ? (
               <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden md:block"><span className="text-xs font-bold block">{googleUser.displayName}</span><span className="text-xs text-slate-500">Shopper</span></div>
                 <img src={googleUser.photoURL} alt="U" className="w-9 h-9 rounded-full border"/>
                 <Button variant="ghost" onClick={handleGoogleLogout} className="!px-2"><LogOut size={18}/></Button>
               </div>
            ) : adminUser ? (
               <div className="flex items-center gap-3 pl-2 bg-slate-100 px-3 py-1 rounded-full">
                  <div className="text-right"><span className="text-xs font-bold block">Administrator</span><span className="text-[10px] text-blue-600">Active</span></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><Lock size={14}/></div>
                  <Button variant="ghost" onClick={() => { setAdminUser(null); setView('catalog'); }} className="!px-1 ml-1"><LogOut size={16}/></Button>
               </div>
            ) : <Button variant="primary" onClick={handleGoogleLogin} icon={LogIn}>Sign In</Button>}
        </div>
      </div>
    </nav>
  );

  const renderAdminLoginModal = () => {
    if (!showAdminLogin) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                <div className="text-center mb-8"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div><h2 className="text-2xl font-bold text-slate-900">Admin Access</h2></div>
                <form onSubmit={handleAdminLogin}><Input label="Username" value={adminLoginData.username} onChange={e => setAdminLoginData({...adminLoginData, username: e.target.value})} autoFocus /><Input label="Password" type="password" value={adminLoginData.password} onChange={e => setAdminLoginData({...adminLoginData, password: e.target.value})} /><Button className="w-full mt-6 py-3" icon={LogIn}>Access Dashboard</Button></form>
                <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 p-2 rounded">Demo: <strong>admin</strong> / <strong>password</strong></div>
            </Card>
         </div>
      )}

  const renderCatalogView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {recommendation && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
              <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-2"><Star className="text-yellow-300 fill-yellow-300" size={20}/><span className="text-sm font-bold uppercase tracking-wider">Book of the Day (Powered by Python)</span></div>
                  <h2 className="text-3xl font-bold mb-2">{recommendation.title}</h2>
                  <p className="text-purple-100 mb-4">by {recommendation.author}</p>
                  <Button onClick={() => navigate('details', recommendation)} className="bg-white text-purple-600 hover:bg-purple-50 border-none">View Details</Button>
              </div>
              <div className="hidden md:block pr-8"><Book size={100} className="text-white/80"/></div>
          </div>
      )}

      <div className="mb-10 text-center"><h2 className="text-3xl font-bold mb-4">Catalog</h2><input type="text" placeholder="Search..." className="p-2 border rounded w-full max-w-md" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group hover:shadow-md cursor-pointer overflow-hidden flex flex-col h-full relative">
            {!adminUser && <button onClick={(e) => { e.stopPropagation(); toggleWishlist(book); }} className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm"><Heart size={16} className={wishlist.find(i=>i.id===book.id) ? "fill-red-500 text-red-500" : "text-slate-400"}/></button>}
            <div onClick={() => navigate('details', book)} className="h-48 bg-slate-50 flex items-center justify-center relative">
                <Book size={48} className={`text-${book.cover}-400`}/>
                {book.quantity !== undefined && book.quantity === 0 && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">Out of Stock</span></div>}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold mb-1">{book.title}</h3>
              <p className="text-sm text-slate-500 mb-2">{book.author}</p>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-bold text-blue-600">${book.price}</span>
                    <span className="text-[10px] text-slate-400">{book.quantity !== undefined ? `${book.quantity} in stock` : 'Available'}</span>
                </div>
                {!adminUser && (book.quantity === undefined || book.quantity > 0) && <button onClick={(e) => { e.stopPropagation(); addToCart(book); }} className="p-2 bg-blue-50 rounded-full text-blue-600"><ShoppingCart size={18}/></button>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetailsView = () => (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Button variant="ghost" onClick={() => navigate('catalog')} className="mb-6 pl-0"><ArrowLeft size={20}/> Back</Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`aspect-[3/4] bg-${selectedBook.cover}-50 rounded-xl flex items-center justify-center`}><Book size={100} className={`text-${selectedBook.cover}-400`}/></div>
        <div className="md:col-span-2">
            <div className="flex gap-2 mb-2">
                {recommendation && recommendation.id === selectedBook.id && <Badge color="purple">Python Recommends</Badge>}
                <Badge>{selectedBook.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">{selectedBook.title}</h1>
            <div className="flex gap-4 mb-6">
                {selectedBook.quantity !== undefined && <Badge color={selectedBook.quantity > 0 ? 'green' : 'red'}>{selectedBook.quantity > 0 ? 'In Stock' : 'Out of Stock'}</Badge>}
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-6">${selectedBook.price}</div>
            <p className="text-slate-600 mb-8">{selectedBook.description}</p>
            {!adminUser && (selectedBook.quantity === undefined || selectedBook.quantity > 0) && <Button onClick={() => addToCart(selectedBook)} className="px-8 py-3 text-lg">Add to Cart</Button>}
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => {
    if (!adminUser) return <div className="p-10 text-center">Access Denied.</div>;
    if (isEditing) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">{selectedBook ? 'Edit Book' : 'Add New Book'}</h2><Button variant="ghost" onClick={() => setIsEditing(false)} icon={X}>Cancel</Button></div>
            <Card className="p-6">
                <form onSubmit={handleSaveBook}>
                    <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Input label="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Price ($)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        <Input label="Stock Quantity" type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                    </div>
                    <Input label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                    <div className="mb-6"><label className="text-sm font-medium block mb-1">Description</label><textarea className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/></div>
                    <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button><Button icon={Save}>Save</Button></div>
                </form>
            </Card>
        </div>
      );
    }
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div><h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2><p className="text-slate-500">Manage inventory and track customer orders.</p></div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setAdminTab('inventory')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${adminTab === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Inventory</button>
                <button onClick={() => setAdminTab('orders')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${adminTab === 'orders' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Customer Orders</button>
            </div>
        </div>
        {adminTab === 'inventory' ? (
            <>
                <div className="flex justify-end mb-4"><Button onClick={() => { setSelectedBook(null); setFormData({ title: '', author: '', price: '', category: '', description: '', quantity: '' }); setIsEditing(true); }} icon={Plus}>Add New Book</Button></div>
                <Card className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 border-b"><th className="p-4">Book</th><th className="p-4">Stock</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id} className="border-b hover:bg-slate-50/50">
                                    <td className="p-4 font-medium">{book.title}</td>
                                    <td className="p-4"><Badge color={book.quantity === 0 ? 'red' : book.quantity < 5 ? 'yellow' : 'green'}>{book.quantity} units</Badge></td>
                                    <td className="p-4">${book.price}</td>
                                    <td className="p-4 text-right"><button onClick={() => prepareEdit(book)} className="mr-3 text-blue-600"><Edit2 size={18}/></button><button onClick={() => handleDeleteBook(book.id)} className="text-red-600"><Trash2 size={18}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </>
        ) : (
            <Card>
                 <div className="p-4 bg-slate-50 border-b"><h3 className="font-bold">All Customer Orders</h3></div>
                 {orders.length === 0 ? <div className="p-8 text-center text-slate-500">No orders found.</div> : (
                     <div className="divide-y">
                        {orders.map(order => (
                            <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between mb-4">
                                    <div><span className="font-bold text-lg">{order.id}</span><span className="text-slate-500 text-sm ml-2">{order.date}</span><span className="text-xs ml-2 bg-slate-200 px-2 py-0.5 rounded text-slate-600">User: {order.userId}</span></div>
                                    <Badge color="green">{order.status}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-3 rounded border">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Items Ordered</p>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm mb-1"><span>{item.title} <span className="text-slate-400">x{item.quantity}</span></span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
                                        ))}
                                        <div className="border-t mt-2 pt-2 flex justify-between font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Shipping Details</p>
                                        <p className="text-sm font-bold">{order.shipping.name}</p>
                                        <p className="text-sm text-slate-600">{order.shipping.address}</p>
                                        <p className="text-sm text-slate-600">{order.shipping.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}
            </Card>
        )}
      </div>
    );
  };

  const renderCartView = () => (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
      {cart.length === 0 ? <div className="text-center py-20">Empty Cart</div> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                    <Card key={item.id} className="p-4 flex gap-4 items-center">
                        <div className={`w-20 h-24 bg-${item.cover}-100 rounded flex items-center justify-center text-${item.cover}-400 shrink-0`}><Book size={32}/></div>
                        <div className="flex-1"><h3 className="font-bold">{item.title}</h3><p className="text-sm text-slate-500">${item.price}</p></div>
                        <div className="flex items-center gap-3"><button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-slate-100 rounded">-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-slate-100 rounded">+</button></div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4"><Trash2 size={18}/></button>
                    </Card>
                ))}
            </div>
            <div className="lg:col-span-1"><Card className="p-6 sticky top-24"><h3 className="font-bold mb-4">Total: ${cartTotal.toFixed(2)}</h3><Button onClick={() => setView('checkout')} className="w-full py-3">Checkout</Button></Card></div>
        </div>
      )}
    </div>
  );

  const renderCheckoutView = () => {
    if (orderSuccess) return <div className="text-center py-20"><CheckCircle size={64} className="mx-auto text-green-500 mb-4"/><h2 className="text-2xl font-bold">Order Placed!</h2><Button onClick={() => setView('catalog')} className="mt-6">Back to Store</Button></div>;
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
         <Button variant="ghost" onClick={() => setView('cart')} className="mb-6 pl-0"><ArrowLeft size={20}/> Back</Button>
         <h2 className="text-3xl font-bold mb-8">Checkout</h2>
         <Card className="p-6">
             <h3 className="font-bold mb-4">Shipping Info</h3>
             <form onSubmit={handlePlaceOrder}>
                 <Input label="Name" value={checkoutDetails.name} onChange={e => setCheckoutDetails({...checkoutDetails, name: e.target.value})} required />
                 <Input label="Address" value={checkoutDetails.address} onChange={e => setCheckoutDetails({...checkoutDetails, address: e.target.value})} required />
                 <Input label="Phone" value={checkoutDetails.phone} onChange={e => setCheckoutDetails({...checkoutDetails, phone: e.target.value})} required />
                 <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded font-bold text-center">Total: ${cartTotal.toFixed(2)} (Cash on Delivery)</div>
                 <Button className="w-full mt-6 py-3" icon={CheckCircle}>Confirm Order</Button>
             </form>
         </Card>
      </div>
    );
  };

  const renderOrdersView = () => (
      <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold mb-8">My Order History</h2>
          {orders.filter(o => o.userId === (googleUser?.uid || 'guest')).length === 0 ? <div className="text-center py-20">No orders found.</div> : (
              <div className="space-y-4">
                  {orders.filter(o => o.userId === (googleUser?.uid || 'guest')).map(order => (
                      <Card key={order.id} className="p-6">
                          <div className="flex justify-between border-b pb-4 mb-4"><div><span className="font-bold">{order.id}</span><br/><span className="text-sm text-slate-500">{order.date}</span></div><span className="font-bold text-green-600">{order.status}</span></div>
                          {order.items.map(i => <div key={i.id} className="flex justify-between text-sm mb-1"><span>{i.title} x {i.quantity}</span><span>${i.price}</span></div>)}
                          <div className="border-t pt-4 mt-4 font-bold text-right">Total: ${order.total.toFixed(2)}</div>
                      </Card>
                  ))}
              </div>
          )}
      </div>
  );

  const renderWishlistView = () => (
      <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold mb-8">Wishlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {wishlist.map(book => (
                <Card key={book.id} className="p-4 relative"><button onClick={() => toggleWishlist(book)} className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500"><X size={16}/></button><div className={`h-32 bg-${book.cover}-50 rounded mb-2 flex items-center justify-center`}><Book size={32} className={`text-${book.cover}-400`}/></div><h3 className="font-bold truncate">{book.title}</h3><Button onClick={() => addToCart(book)} size="sm" className="w-full mt-2">Add to Cart</Button></Card>
            ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      {renderNavbar()}
      {renderAdminLoginModal()}
      <main>
        {view === 'catalog' && renderCatalogView()}
        {view === 'details' && selectedBook && renderDetailsView()}
        {view === 'cart' && renderCartView()}
        {view === 'wishlist' && renderWishlistView()}
        {view === 'orders' && renderOrdersView()}
        {view === 'checkout' && renderCheckoutView()}
        {view === 'admin' && renderAdminView()}
      </main>
    </div>
  );
}