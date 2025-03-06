'use client'
import { authService } from '@/services/api.services';

const RefreshComponent = () => {

  const onClickRefreshHandler = async () => {
    try {
      await authService.refresh()
      console.log('success refresh');
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  }

    return (
      <div>
        <h1>Haven't seen you for a while. Wanna continue?</h1>
          <button onClick={onClickRefreshHandler}>Continue</button>
      </div>
    )
}
export default RefreshComponent;