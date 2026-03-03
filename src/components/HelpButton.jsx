const TEL_LINK = 'tel:+18446099922';

/**
 * Floating Help button - triggers call to support.
 */
function HelpButton() {
  return (
    <a
      href={TEL_LINK}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Call for help"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.418.418c-.346.244-.656.453-.918.605a.75.75 0 11-.712-1.322c.217-.117.465-.264.752-.456.313-.207.656-.444 1.009-.726 1.513-1.324 1.513-3.518 0-4.842zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
      <span className="font-medium text-sm">Help</span>
    </a>
  );
}

export default HelpButton;
