import React, { useState, useEffect } from 'react';
import type { Observer, RefereeCategory } from '../types.ts';
import Button from './ui/Button.tsx';

interface ObserverFormProps {
  observer?: Observer | null;
  onSave: (data: Omit<Observer, 'id' | 'photoUrl'> & { photoFile?: File | null }) => void;
  onClose: () => void;
}

const romanianCounties = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila",
    "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița",
    "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov",
    "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu",
    "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

const observerCategories: RefereeCategory[] = ['ASPIRANTI', 'STAGIARI', 'CATEGORIA 3', 'CATEGORIA 2', 'CATEGORIA 1'];

const ObserverForm: React.FC<ObserverFormProps> = ({ observer, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<RefereeCategory>('ASPIRANTI');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (observer) {
        setName(observer.name);
        setCounty(observer.county || '');
        setCity(observer.city || '');
        setDateOfBirth(observer.dateOfBirth ? new Date(observer.dateOfBirth).toISOString().slice(0,10) : '');
        setPhone(observer.phone || '');
        setEmail(observer.email || '');
        setCategory(observer.category || 'ASPIRANTI');
        setPreviewUrl(observer.photoUrl || null);
    } else {
      setName('');
      setCounty('');
      setCity('');
      setDateOfBirth('');
      setPhone('');
      setEmail('');
      setCategory('ASPIRANTI');
      setPreviewUrl(null);
    }
    setPhotoFile(null);
    setError('');
  }, [observer]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Observer name is required.');
      return;
    }
    onSave({ 
        name, 
        county, 
        city,
        dateOfBirth,
        phone,
        email,
        category,
        photoFile 
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center space-x-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Foto</label>
                <img src={previewUrl || `https://avatar.iran.liara.run/username?username=${name.replace(/\s/g, '+')}`} alt="Observer" className="mt-1 h-20 w-20 rounded-full object-cover bg-gray-100" />
            </div>
            <div className="flex-grow">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium">Observer Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
                </div>
                <input type="file" onChange={handleFileChange} accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="county" className="block text-sm font-medium">Județ</label>
                <select id="county" value={county} onChange={e => setCounty(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                    <option value="">Selectează...</option>
                    {romanianCounties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium">Localitate</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
        </div>

        <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium">Data Nașterii</label>
            <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="phone" className="block text-sm font-medium">Telefon</label><input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
            <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        </div>

        <div>
            <label htmlFor="category" className="block text-sm font-medium">Categoria</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value as RefereeCategory)} className="mt-1 block w-full border rounded-md p-2">
                {observerCategories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default ObserverForm;