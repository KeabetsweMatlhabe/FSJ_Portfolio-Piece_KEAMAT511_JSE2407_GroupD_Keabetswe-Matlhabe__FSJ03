import Link from 'next/link';

export default function Pagination({ currentPage, totalProducts, limit }) {
  const pageNumber = parseInt(currentPage, 10);
  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
  const nextPage = pageNumber + 1;

  return (
    <div className="flex justify-between items-center mt-8">
      {prevPage && (
        <Link href={`/?page=${prevPage}`} className="px-4 py-2 bg-gray-300 text-black rounded-md">
          
        </Link>
      )}
      
      <span> {currentPage} of {pageNumber}</span>
      
      {/* {nextPage ? ( */}
        <Link href={`/?page=${nextPage}`} className="px-4 py-2 bg-gray-300 text-black rounded-md">
          
        </Link>
      {/* ) : (
        <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
          Next
        </span>
      )} */}
    </div>
  );
}