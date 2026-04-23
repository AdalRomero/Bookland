import { supabase } from "@/lib/supabase/supabase";

export interface Book {
  id?: string;
  title: string;
  author: string;
  synopsis: string;
  cover_url: string;
  epub_url?: string;
  isbn?: string;
  pages?: number;
  published_date?: string;
  google_books_id?: string;
}

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export const searchGoogleBooks = async (query: string): Promise<Book[]> => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20${GOOGLE_API_KEY ? `&key=${GOOGLE_API_KEY}` : ''}`;
    const response = await fetch(url);
    
    if (response.status === 429) {
      console.error('Límite de peticiones excedido (429). Considera usar una API Key válida.');
      return [];
    }

    const data = await response.json();
    
    if (!data.items) return [];

    return data.items.map((item: any) => {
      const info = item.volumeInfo;
      return {
        google_books_id: item.id,
        title: info.title,
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        synopsis: info.description || 'No description available.',
        cover_url: (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '').replace('&zoom=1', '&zoom=3').replace('http://', 'https://'),
        isbn: info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier || '',
        pages: info.pageCount || 0,
        published_date: info.publishedDate || '',
      };
    });
  } catch (error) {
    console.error('Error searching Google Books:', error);
    return [];
  }
};

export const getLocalBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching local books:', error);
    return [];
  }

  return data || [];
};

export const saveBookToLocal = async (book: Book): Promise<boolean> => {
  const { error } = await supabase
    .from('books')
    .upsert(book, { onConflict: 'google_books_id' });

  if (error) {
    console.error('Error saving book:', error);
    return false;
  }

  return true;
};
